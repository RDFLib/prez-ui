<script lang="ts" setup>

/// <reference path="../../node_modules/@types/google.maps/index.d.ts" /> 

import { wktToGeoJSON } from "@terraformer/wkt"
import { inject, reactive, ref, watch, type PropType } from 'vue'
import { mapConfigKey, type MapConfig } from "@/types";
import { convertConfigTypes } from '@/util/mapSearchHelper'
import type { MapOptionsCenter } from '@/types'
import type { WKTResult } from '@/stores/mapSearchStore.d';
import { ShapeTypes, type DrawingModes } from "@/components/MapClient.d";


// selectionUpdated is emitted when a selection has changed on map
// the coords of the selection along with the type of selection is provided
const emits = defineEmits(['selectionUpdated'])

// get the default map settings
const mapConfig = convertConfigTypes(inject(mapConfigKey)) as MapConfig;

const mapRef = ref()

const shape = reactive({
  value: {}
});

const props = defineProps({
    center: Object as PropType<MapOptionsCenter>,
    zoom: Number,
    streetViewController: Boolean,
    geoWKT: Object as PropType<WKTResult[]>,
    drawingModes: Object as PropType<DrawingModes[]>
})

// when the map object has loaded, it will call this function to set mapDrawFunc, so an external component can call it when needed

let mapDrawFunc: Function | null = null
const setMapDrawFunc = (func: Function) => {
    mapDrawFunc = func
}

// draw shape is exposed so another component can draw on the map
const drawShape = (data: WKTResult[]) => {
    if (mapDrawFunc) {
        mapDrawFunc(data)
    }    
}

defineExpose({drawShape})

watch(mapRef, googleMap => {
      if (googleMap) {
        googleMap.$mapPromise.then((map: google.maps.Map) => {
            const shapeOptions = {
                strokeColor: "green",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "green",
                fillOpacity: 0.35
            };
            const setShape = (value: string) => {
                shape.value = value
            }
            let lastRectangle: google.maps.Rectangle | google.maps.Polygon | null = null
            let lastPoint: google.maps.Marker | null = null
            var infowindow = new google.maps.InfoWindow();

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: props.drawingModes ? props.drawingModes.map(mode=>google.maps.drawing.OverlayType[mode]) : []
                },
                markerOptions: {
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                },
                rectangleOptions: shapeOptions
            });
            if(props.drawingModes) {
                drawingManager.setMap(map);
            }
            let features = []

            const drawResults = (results: WKTResult[]) => {
                // remove the previously drawn features
                map.data.forEach(function(feature) {
                    map.data.remove(feature)
                })
                features = []
                results.forEach(result=>{
                    try {
                        const geoJson = wktToGeoJSON(result.wkt)
                        const featureGeoJson = {
                            type: 'Feature',
                            geometry: geoJson,
                            properties: {
                                uri: result.uri,
                                link: result.link,
                                label: result.label,
                                id: result.id
                            }
                        }
                        features.push(map.data.addGeoJson(featureGeoJson))
                        const bounds = new google.maps.LatLngBounds();
                        map.data.forEach(function (feature) {
                            feature.getGeometry()!.forEachLatLng(function (latlng) {
                                bounds.extend(latlng);
                            });
                        });
                        setShape(result.wkt)
                        map.fitBounds(bounds);                
                    } catch (ex) {
                        // can happen if we're unable to parse the result, just consoled out for now
                        console.log((ex as Error).message, 'Unable to process ', result)
                    }
                })
            }

            setMapDrawFunc(drawResults)

            if(props.geoWKT) {
                drawResults(props.geoWKT)
            }

            const clearShapes = () => {
                emits("selectionUpdated", [], ShapeTypes.None)
                if(lastPoint) {
                    lastPoint.setMap(null)
                }
                lastPoint = null;

                if (lastRectangle) {
                    lastRectangle.setMap(null);
                }
                lastRectangle = null;
            }

            let clearBtnMenu = document.createElement("div");
            clearBtnMenu.style.margin = "5px";
            clearBtnMenu.style.zIndex = "10";

            let clearBtnContainer = document.createElement("div");
            clearBtnContainer.style.lineHeight = "0";
            clearBtnMenu.appendChild(clearBtnContainer);

            let clearBtn = document.createElement("button");
            clearBtn.title = "Clear Map Shapes";
            clearBtn.id = "clear-polygon-btn";
            clearBtn.innerHTML = 'X';
            clearBtn.addEventListener("click", clearShapes);
            clearBtnContainer.appendChild(clearBtn);

            if(props.drawingModes) {
                map.controls[google.maps.ControlPosition.TOP_CENTER].push(clearBtnMenu);
            }

            let pointToWKT = (coord: [number, number]) => {
                emits("selectionUpdated", [coord], ShapeTypes.Point);
                return `POINT (${coord[0]} ${coord[1]})`;
            }
            let onPointDraw = (pnt: google.maps.Marker) => {
                clearShapes()
                lastPoint = pnt
                let coord:[number, number] = [pnt.getPosition()!.lng(), pnt.getPosition()!.lat()]
                let wkt = pointToWKT(coord)
                setShape(wkt)
            }

            let rectangleToWKT = (coords: [number, number][]) => {
                return "POLYGON ((" + coords.map(coord=>`${coord[0]} ${coord[1]}`).join(', ') + '))';
            }
            let onRectangleDraw = (rect: google.maps.Rectangle) => {
                clearShapes()
                lastRectangle = rect
                let ne = rect.getBounds()!.getNorthEast()
                let sw = rect.getBounds()!.getSouthWest()
                let coords:[number, number][] = [
                    [ne.lng(), ne.lat()],
                    [ne.lng(), sw.lat()],
                    [sw.lng(), sw.lat()],
                    [sw.lng(), ne.lat()],
                    [ne.lng(), ne.lat()]
                ];
                let wkt = rectangleToWKT(coords)
                setShape(wkt)
                emits("selectionUpdated", coords, ShapeTypes.Rectangle);
            }
            const onPolygonDraw = (poly: google.maps.Polygon) => {
                clearShapes()
                lastRectangle = poly
                const coordinates = poly.getPath().getArray();
                const coords: [number, number][] = []
                for (var i = 0; i < coordinates.length; i++) {
                    coords.push([coordinates[i].lng(), coordinates[i].lat()])
                }
                // make sure the polygon is closed
                if(coords.length > 0) {
                    coords.push(coords[0])
                }
                const wkt = rectangleToWKT(coords)
                setShape(wkt)
                emits("selectionUpdated", coords, ShapeTypes.Polygon);
            }

            drawingManager.addListener("", onPointDraw);
            drawingManager.addListener("markercomplete", onPointDraw);
            drawingManager.addListener("rectanglecomplete", onRectangleDraw);
            drawingManager.addListener("polygoncomplete", onPolygonDraw);

            // show an info box with the details of the object clicked
            map.data.addListener('click', function(event: google.maps.Data.MouseEvent) {
                var feat = event.feature;
                var html = `<b><a target="_blank" href="${feat.getProperty('link')}">${feat.getProperty('label')}</a></b>`
                infowindow.setContent(html);
                infowindow.setPosition(event.latLng);
                infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
                infowindow.open(map);
            });
        })
      }
});

</script>

<template>
    <GMapMap
        ref="mapRef"
        :center="props.center || mapConfig.settings.options.center"
        :street-view-control="props.streetViewController || mapConfig.settings.options.streetViewController"
        :zoom="props.zoom || mapConfig.settings.options.zoom"
        map-type-id="terrain"
        style="width: 100%; height: 500px; background-color: #eee;" 
    >
    </GMapMap>

</template>
