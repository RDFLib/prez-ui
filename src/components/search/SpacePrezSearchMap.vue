<script lang="ts" setup>

// the searchable map component and related map type definitions
import MapClient from "@/components/MapClient.vue";
import { AreaTypes, ShapeTypes, type Coords } from "@/components/MapClient.d";

// the pinia search store and related type definitions to manage the returned dataset tree
import { datasetsStore } from "@/stores/datasetsStore";
import type { DatasetTree, DatasetTreeNode } from '@/stores/datasetsStore.d'

// sparql query generation
import { mapSearchToSparql } from '@/util/mapSearchHelper'
import { mapConfigKey, type MapConfig } from "@/types";
import { convertConfigTypes } from '@/util/mapSearchHelper'

import { ref, onMounted, inject } from "vue";

// a general button group component to render a set of buttons
import ButtonGroup from "@/components/ButtonGroup.vue";

// turn a list of enums into a a set of options for the button group
import { enumToOptions } from '@/util/mapSearchHelper'
import { mapSearchStore} from "@/stores/mapSearchStore";
import type { WKTResult } from '@/stores/mapSearchStore.d'

// show debug info at the bottom of the page, could be moved to config
const debugMode = false

// get the default map settings
const mapConfig = convertConfigTypes(inject(mapConfigKey)) as MapConfig;

// the search store setup
const datasets = datasetsStore()
const mapSearch = mapSearchStore()
const datasetTreeRef = ref<DatasetTree>([])
const selectedDatasetsRef = ref<string[]>([])
const selectedFeaturesRef = ref<string[]>([])

// map info refs
const searchMapRef = ref()
const shapeTypeRef = ref(ShapeTypes.None)
const coordsRef = ref<Coords>([])
const areaTypeRef = ref(AreaTypes.Nearby)
const radiusRef = ref(5)
const limitRef = ref(10)
const showQueryRef = ref(false)
const sparqlQueryRef = ref('')

// to hold the wkt shape response from the map search
const responseRef = ref<WKTResult[]>()

/** search for any shapes that should be added to the map */
const performMapSearch = async () => {
    sparqlQueryRef.value = mapSearchToSparql(
        selectedFeaturesRef.value, 
        coordsRef.value, 
        areaTypeRef.value, 
        radiusRef.value, 
        limitRef.value, 
        mapConfig.search
    )
    await mapSearch.searchMap(sparqlQueryRef.value)
    if(mapSearch.success) {
        // responseRef is only updated to show in the debug window, if active
        responseRef.value = mapSearch.data
        // draw the shape onto the map
        searchMapRef.value.drawShape(mapSearch.data)
    }
}

/** get the data from the search store  */
const fetchData = async () => {
    await datasets.fetchSpacePrezData()
    if(datasets.success) {
        datasetTreeRef.value = datasets.getDatasetTree()
    }
}

// start off by loading the SPARQL query result data into the search store
onMounted(async ()=>{
    await fetchData()

    // start with all items selected
    datasetTreeRef.value.forEach(ds=>{
        selectedDatasetsRef.value.push(ds.item.subject)
        ds.featureCollections.forEach(fc=>{
            selectedFeaturesRef.value.push(fc.subject)
        })
    })

})

// called when a selection has changed
const updateSelection = async (selectedCoords:Coords, shapeType:ShapeTypes) => {
    //shapeTypeRef.value = selectedCoords.length == 0 ? ShapeTypes.None : (selectedCoords.length == 1 ? ShapeTypes.Point : ShapeTypes.Polygon)
    shapeTypeRef.value = shapeType
    coordsRef.value = selectedCoords
    await performMapSearch()
}

// convert out areatypes into a list of options format to show as buttons
const areaButtons = enumToOptions(AreaTypes)

// triggered when a change of area type has been clicked
const handleAreaButtonChange = async (values: AreaTypes[]) => {
    areaTypeRef.value = values[0]
    await performMapSearch()
}

/** toggle selected features under a dataset */
const toggleAllFeatures = async (datasetNode:DatasetTreeNode, checked:boolean) => {
    // If the "select all" checkbox is checked, add all feature collections to selectedFeatures
    //alert(checked + ',' + JSON.stringify(selectedDatasetsRef.toString()))
    if (checked) {
        datasetNode.featureCollections.forEach(fc => {
            if (!selectedFeaturesRef.value.includes(fc.subject)) {
                selectedFeaturesRef.value.push(fc.subject);
            }
        })
    } else {
        // If it's unchecked, remove all feature collections from selectedFeatures    
        datasetNode.featureCollections.forEach(fc => {
            const index = selectedFeaturesRef.value.indexOf(fc.subject);
            if (index >= 0) {
                selectedFeaturesRef.value.splice(index, 1);
            }
        });
    }
    await performMapSearch()
    return true
}

</script>

<template>
    <div class="container">
        <div class="left-panel">

            <form action="" class="query-options">
                <div class="query-option">
                    <h4 class="query-option-title">Search map selection</h4>
                    <div class="btn sm outline">{{ shapeTypeRef }}</div>
                    <p />
                    <div v-if="shapeTypeRef == ShapeTypes.None">Select a point or rectangle on the map to begin</div>
                    <p />
                    <ButtonGroup v-if="shapeTypeRef != ShapeTypes.None" @change="handleAreaButtonChange" :buttons="areaButtons" :allowMultipleSelection="false" />
                    <div v-if="shapeTypeRef != ShapeTypes.None && areaTypeRef == AreaTypes.Nearby" style="padding-top:10px;font-size:0.7em">
                        within <input class="small-input" v-model="radiusRef" /> km
                    </div>
                    <p />
                </div>

                <div class="query-option">
                    <h4 class="query-option-title">Find features and datasets</h4>
                    <div v-if="datasets.loading">Loading...</div>
                    <div class="error" v-else-if="datasets.error">Unable to load datasets: {{ datasets.error }}</div>
                    <div v-for="datasetNode in datasetTreeRef">
                        <ul>
                            <li>
                                <label>
                                    <input type="checkbox" 
                                        :value="datasetNode.item.subject" 
                                        v-model="selectedDatasetsRef" 
                                        @change="(event) => toggleAllFeatures(datasetNode, (event.target as HTMLInputElement)?.checked)"
                                    /> {{ datasetNode.item.object }}
                                </label>
                                <ul v-if="datasetNode.featureCollections.length > 0">
                                    <li v-for="fc in datasetNode.featureCollections">
                                        <label>
                                            <input type="checkbox"
                                                :value="fc.subject" 
                                                v-model="selectedFeaturesRef" 
                                                @change="performMapSearch()"
                                            />{{ fc.object }}
                                        </label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <p />
                
                <span class="nowrap">Results limit: <input id="input-limit" class="space-right" @change="performMapSearch()" v-model="limitRef" /></span>
                <span class="nowrap"><label class="space-right"><input v-model="showQueryRef" type="checkbox">Show query</label></span>
                <button @click="performMapSearch" v-bind:disabled="shapeTypeRef == ShapeTypes.None" class="btn" type="submit">Search</button>
            </form>    

        </div>
        <div class="right-panel">
            <MapClient 
                ref="searchMapRef" 
                :geo-w-k-t="responseRef" 
                :drawing-modes="['MARKER', 'POLYGON', 'RECTANGLE']"
                @selectionUpdated="updateSelection" 
            />
            <div v-if="mapSearch.data && mapSearch.data.length > 0">
                <h3>Result set</h3>
                <table>
                    <thead>
                        <th>Feature collection</th>
                        <th>Label</th>
                        <th>URI</th>
                    </thead>
                    <tbody>
                        <tr v-for="result in mapSearch.data">
                            <td>{{ result.fcLabel }}</td>
                            <td>{{ result.label }}</td>
                            <td><a v-bind:href="`${result.link}`">{{ result.uri }}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>    
            <div v-else>
                <h3>No results</h3>
            </div>
        </div>
    </div>

<pre v-if="showQueryRef" class="debug">

<b>SPARQL query:</b>

{{ sparqlQueryRef }}

<div v-if="debugMode"> 
<b>Debug area</b>

- <button @click="fetchData">Fetch Data</button>

- Selected shape type = {{ shapeTypeRef }}

- Selected coords = {{  JSON.stringify(coordsRef) }}

- MAP SEARCH RESPONSE:

{{ responseRef }}
</div>

</pre>

</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

table {
    border-collapse: collapse;
    background-color: white;
    width:100%;
    thead {
        th {
            padding: 10px;
            background-color: #ccc;
        }
    }
    tbody {
        td {
            padding: 5px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    tr {
        th, td {
        }

        th {
            text-align: center;
        }

        &:nth-child(2n) {
            background-color: $tableBg;
        }
    }
}


.container {
    display: grid;
    grid-template-columns: 1fr 3fr; /* set the column widths to 1/4 and 3/4 of the container width */
}

.space-right {
    margin-right:1em;    
}

#input-limit {
    width:3em;
}

.nowrap {
    display:inline-block;
    white-space: nowrap;
    margin-top:10px;
}

.left-panel {
    min-width: 320px;
    padding-right: 1em;
}
.right-panel {
}

pre.debug {
    white-space: break-spaces;
}

.small-input {
    font-size:small;
    height:1.5em;
    width:3em; 
}
.query-options {
    gap: 10px;
    background-color: $cardBg;
    padding: 10px;
    border-radius: $borderRadius;

    .query-option {

        padding-bottom: 20px;

        .query-option-title {
            padding-top:0;
            margin-top:5px;
            margin-bottom:8px;
        }

        .button {

        }

    }
}

.error {
    background-color: lightcoral;
    display: inline-block;
}

</style>