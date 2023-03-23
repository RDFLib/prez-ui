<script lang="ts" setup>
import { wktToGeoJSON } from "@terraformer/wkt"
import { inject, reactive, ref, defineEmits, defineExpose, watch, type PropType } from 'vue'
import { configKey, defaultConfig } from "@/types";
import type { MapOptionsCenter } from '@/types'
import type { WKTResult } from '@/stores/mapSearch';
import { ShapeTypes } from "@/components/SearchMap.d";

// selectionUpdated is emitted when a selection has changed on map
// the coords of the selection along with the type of selection is provided
const emits = defineEmits(['selectionUpdated'])

// get the default map settings
const { mapSettings } = inject(configKey, defaultConfig);

const mapRef = ref()

const shape = reactive({
  value: {}
});

const props = defineProps({
    center: Object as PropType<MapOptionsCenter>,
    zoom: Number,
    streetViewController: Boolean,
    geoWKT: Object as PropType<WKTResult[]>
})

// when the map object has loaded, it will call this function to set mapDrawFunc, so an external component can call it when needed
let mapDrawFunc = null
const setMapDrawFunc = (func) => {
    mapDrawFunc = func
}

// draw shape is exposed so another component can draw on the map
const drawShape = (data) => {
    mapDrawFunc(data)
}

defineExpose({drawShape})

watch(mapRef, googleMap => {
      if (googleMap) {
        googleMap.$mapPromise.then(map=> {
            const shapeOptions = {
                strokeColor: "green",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "green",
                fillOpacity: 0.35
            };
            const setShape = (value) => {
                shape.value = value
                //console.log(shape.value)
            }
            let lastRectangle = null
            let lastPoint = null
            var infowindow = new google.maps.InfoWindow();

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.MARKER,
                        google.maps.drawing.OverlayType.RECTANGLE,
                        google.maps.drawing.OverlayType.POLYGON
                    ]
                },
                markerOptions: {
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                },
                rectangleOptions: shapeOptions
            });
            drawingManager.setMap(map);
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
                                label: result.label,
                                id: result.id
                            }
                        }
                        features.push(map.data.addGeoJson(featureGeoJson))
                        const bounds = new google.maps.LatLngBounds();
                        map.data.forEach(function (feature) {
                            feature.getGeometry().forEachLatLng(function (latlng) {
                                bounds.extend(latlng);
                            });
                        });
                        setShape(result.wkt)
                        map.fitBounds(bounds);                
                    } catch (ex) {
                        // can happen if we're unable to parse the result, just consoled out for now
                        console.log(ex.message, 'Unable to process ', result)
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

            map.controls[google.maps.ControlPosition.TOP_CENTER].push(clearBtnMenu);

            let pointToWKT = (coord) => {
                emits("selectionUpdated", [coord], ShapeTypes.Point);
                return `POINT (${coord[0]} ${coord[1]})`;
            }
            let onPointDraw = (pnt) => {
                clearShapes()
                lastPoint = pnt
                let coord = [pnt.getPosition().lng(), pnt.getPosition().lat()]
                let wkt = pointToWKT(coord)
                setShape(wkt)
            }

            let rectangleToWKT = (coords) => {
                let wkt = "POLYGON ((";

                coords.forEach(coord => {
                    wkt += `${coord[0]} ${coord[1]}, `;
                });

                wkt = wkt.slice(0, -2); // removes last ", "

                wkt += "))";

                return wkt;
            }
            let onRectangleDraw = (rect) => {
                clearShapes()
                lastRectangle = rect
                let ne = rect.getBounds().getNorthEast()
                let sw = rect.getBounds().getSouthWest()
                let coords = [
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
            const onPolygonDraw = (poly) => {
                clearShapes()
                lastRectangle = poly
                const coordinates = poly.getPath().getArray();
                const coords = []
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
            map.data.addListener('click', function(event) {
                var feat = event.feature;
                var html = `<b>${feat.getProperty('label')}</b>
                    <b style="float:right">(${feat.getProperty('id')})</b>
                    <br>
                    ${feat.getProperty('uri')}
                    <br><a class="normal_link" target="_blank" href="${feat.getProperty('uri')}">uri</a>`
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
        :center="props.center || mapSettings.options.center" 
        :street-view-control="props.streetViewController || mapSettings.options.streetViewController"
        :zoom="props.zoom || mapSettings.options.zoom"
        map-type-id="terrain"
        style="width: 100%; height: 500px" 
    >
    </GMapMap>


</template>
