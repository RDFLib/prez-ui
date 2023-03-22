
<script lang="ts" setup>

// the searchable map component and related map type definitions
import SearchMap from "@/components/SearchMap.vue";
import { AreaTypes, ShapeTypes, type Coords } from "@/components/SearchMap.d";

// the pinia search store and related type definitions to manage the returned dataset tree
import { searchStore } from "@/stores/search";
import type { DatasetTree, DatasetTreeNode } from '@/stores/search.d'

// sparql query generation
import { mapSearchToSparql } from '@/util/helper'

import { ref, onMounted } from "vue";

// a general button group component to render a set of buttons
import ButtonGroup from "./ButtonGroup.vue";

// turn a list of enums into a a set of options for the button group
import { enumToOptions } from '../util/helper'
import { mapsearchStore, WKTResult } from "@/stores/mapsearch";

// the search store setup
const search = searchStore()
const mapsearch = mapsearchStore()
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

const responseRef = ref<WKTResult[]>()

const geoSearch = async () => {
    const query = mapSearchToSparql(selectedFeaturesRef.value, coordsRef.value, areaTypeRef.value, radiusRef.value, limitRef.value)
    responseRef.value = await mapsearch.fetchMapData(query)
    //console.log("MAP REF = ", searchMapRef.value)
    searchMapRef.value.trigger(responseRef.value)
}

/** get the data from the search store  */
const fetchData = async () => {
    await search.fetchSpacePrezData()
    if(search.success) {
        datasetTreeRef.value = search.getDatasetTree()
    }
}

// start off by loading the SPARQL query result data into the search store
onMounted(async ()=>{
    await fetchData()
})

// called when a selection has changed
const updateSelection = async (selectedCoords:Coords, shapeType:ShapeTypes) => {
    //shapeTypeRef.value = selectedCoords.length == 0 ? ShapeTypes.None : (selectedCoords.length == 1 ? ShapeTypes.Point : ShapeTypes.Polygon)
    shapeTypeRef.value = shapeType
    coordsRef.value = selectedCoords
    await geoSearch()
}

// convert out areatypes into a list of options format to show as buttons
const areaButtons = enumToOptions(AreaTypes)

// triggered when a change of area type has been clicked
const handleAreaButtonChange = async (values: AreaTypes[]) => {
    areaTypeRef.value = values[0]
    await geoSearch()
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
    await geoSearch()
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
                    <div v-if="search.loading">Loading...</div>
                    <div class="error" v-else-if="search.error">Unable to load datasets: {{ search.error }}</div>
                    <div v-for="datasetNode in datasetTreeRef">
                        <ul>
                            <li>
                                <label>
                                    <input type="checkbox" 
                                        :value="datasetNode.item.subject" 
                                        v-model="selectedDatasetsRef" 
                                        @change="toggleAllFeatures(datasetNode, $event.target.checked)"
                                    /> {{ datasetNode.item.object }}
                                </label>
                                <ul v-if="datasetNode.featureCollections.length > 0">
                                    <li v-for="fc in datasetNode.featureCollections">
                                        <label>
                                            <input type="checkbox"
                                                :value="fc.subject" 
                                                v-model="selectedFeaturesRef" 
                                                @change="geoSearch()"
                                            />{{ fc.object }}
                                        </label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <p />
                Results limit: <input @change="geoSearch()" v-model="limitRef" style="width:5em"/>
                <button @click="geoSearch" v-bind:disabled="shapeTypeRef == ShapeTypes.None" class="btn" type="submit">Search</button>
            </form>    

        </div>
        <div class="right-panel">
            <SearchMap ref="searchMapRef" :geo-w-k-t="responseRef" @selectionUpdated="updateSelection" />            
        </div>
    </div>

<pre style="padding-left: 0;white-space: break-spaces;">
<b>Debug area</b>

- <button @click="fetchData">Fetch Data</button>

- Selected shape type = {{ shapeTypeRef }}

- Selected coords = {{  JSON.stringify(coordsRef) }}

- SPARQL query:

{{ mapSearchToSparql(selectedFeaturesRef, coordsRef, areaTypeRef, radiusRef, limitRef) }}

- RESPONSE:

{{ responseRef }}

</pre>

</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.container {
    display: grid;
    grid-template-columns: 1fr 3fr; /* set the column widths to 1/4 and 3/4 of the container width */
}

.left-panel {
    min-width: 320px;
    padding-right: 1em;
}
.right-panel {
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