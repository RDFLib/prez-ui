<script lang="ts" setup>

import { inject, reactive, ref, watch } from 'vue'
import { configKey, defaultConfig } from "@/types";

const { mapSettings } = inject(configKey, defaultConfig);

const mapRef = ref()


const shape = reactive({
  value: {}
});

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
                console.log(shape.value)
            }
            let lastRectangle = null
            let lastPoint = null

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.MARKER,
                        google.maps.drawing.OverlayType.RECTANGLE
                    ]
                },
                markerOptions: {
                    icon: 'icons/blue-dot.png'
                },
                rectangleOptions: shapeOptions
            });
            drawingManager.setMap(map);

            const clearShapes = () => {
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
            }

            drawingManager.addListener("markercomplete", onPointDraw);
            drawingManager.addListener("rectanglecomplete", onRectangleDraw);
            
        })
      }
});
</script>

<template>
    <div>{{ shape.value }}</div>
    <GMapMap
        ref="mapRef"
        :center="mapSettings.options.center" 
        :street-view-control="mapSettings.options.streetViewController"
        :zoom="mapSettings.options.zoom"
        map-type-id="terrain"
        style="width: 100%; height: 500px" 
    >
    </GMapMap>
</template>