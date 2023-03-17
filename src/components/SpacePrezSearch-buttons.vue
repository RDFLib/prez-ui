<script lang="ts" setup>
import SearchMap from "@/components/SearchMap.vue";
import { searchStore } from "@/stores/search";
import type { SimpleQueryResult, DatasetTree, DatasetTreeNode } from '@/stores/search.d'
import { ref, onMounted } from "vue";
import ButtonGroup from "./ButtonGroup.vue";
import type { ButtonOption } from '../util/helper'
import { enumToOptions, simpleQueryResultToOptions } from '../util/helper'

const search = searchStore()

const datasetTree = ref<DatasetTree>([])

const listDatasetsRef = ref<SimpleQueryResult[]>([])
const datasetOptionsRef = ref<ButtonOption[]>([])
const featureCollectionsOptionsRef = ref<ButtonOption[]>([])
const selectedDatasets:string[] = []
const selectedFeaturesRef = ref<string[]>([])

const toggleAllFeatures = (datasetNode:DatasetTreeNode, checked:boolean) => {
    // If the "select all" checkbox is checked, add all feature collections to selectedFeatures
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
}

const fetchData = async () => {
    listDatasetsRef.value = []
    console.log("ABOUT TO SEARHC")
    await search.fetchSpacePrezData()
    if(search.success) {
        datasetTree.value = search.getDatasetTree()
        listDatasetsRef.value = search.getDatasets()
        datasetOptionsRef.value = simpleQueryResultToOptions(listDatasetsRef.value)
        featureCollectionsOptionsRef.value = simpleQueryResultToOptions(search.getFeatureCollections([]))
    }
//        console.log("SETTING DS TO ", listDatasets)
}

onMounted(async ()=>{
    await fetchData()
})

enum AreaTypes {
    Nearby='Nearby',
    Contains='Contains',
    Overlaps='Overlaps',
    Within='Within'
}

const areaTypeRef = ref(AreaTypes.Nearby)

type Coords = Coord[]
type Coord = [number, number]
enum ShapeTypes {
    None='No selection', Point='Point selected', Polygon='Polygon selected'
}

const shapeType = ref(ShapeTypes.None)
const coords = ref<Coords>([])

const updateSelection = (selectedCoords:Coords) => {
    shapeType.value = selectedCoords.length == 0 ? ShapeTypes.None : (selectedCoords.length == 1 ? ShapeTypes.Point : ShapeTypes.Polygon)
    coords.value = selectedCoords
}

const areaButtons = enumToOptions(AreaTypes)

const handleAreaButtonChange = (values: AreaTypes[]) => {
    areaTypeRef.value = values[0]
}

const selectedDatasetsRef = ref<string[]>([])
const fcRef = ref<SimpleQueryResult[]>([])

const handleDatasetButtonChange = (values: []) => {
    selectedDatasetsRef.value = values
    console.log(values)
    fcRef.value = search.getFeatureCollections(values)
    featureCollectionsOptionsRef.value = simpleQueryResultToOptions(fcRef.value)
}

</script>

<template>
    <div class="container">
        <div class="left-panel">

            <form action="" class="query-options">
                <div class="query-option">
                    <h4 class="query-option-title">Search map selection</h4>
                    <div class="btn sm outline">{{ shapeType }}</div>
                    <p />
                    <div v-if="shapeType == ShapeTypes.None">Select a point or rectangle on the map to begin</div>
                    <p />
                    <ButtonGroup v-if="shapeType != ShapeTypes.None" @change="handleAreaButtonChange" :buttons="areaButtons" :allowMultipleSelection="false" />
                    <div v-if="shapeType != ShapeTypes.None && areaTypeRef == AreaTypes.Nearby" style="padding-top:10px;font-size:0.7em">
                        within <input style="font-size:small;height:1.5em;width:3em;" type="text" value="5"/> km
                    </div>
                    <p />
                    
                </div>

                <div class="query-option">
                    <h4 class="query-option-title">Find features by datasets &amp; features</h4>
                    <div v-if="search.loading">Loading...</div>
                    <div class="error" v-else-if="search.error">Unable to load datasets: {{ search.error }}</div>
                    <div v-else>
                        <b>Datasets:</b>
                        <p>
                            <ButtonGroup :buttons="datasetOptionsRef" @change="handleDatasetButtonChange" :allow-multiple-selection="true" />
                        </p>
                        <b><span v-if="selectedDatasetsRef.length == 0">All</span><span v-else>Selected</span> Feature Collections:</b>
                        <p>
                            <ButtonGroup :buttons="featureCollectionsOptionsRef" :allow-multiple-selection="true" />
                        </p>
                    </div>
                </div>

                <div class="query-option">
                    <h4 class="query-option-title">Dataset Tree:</h4>
                    <div v-for="datasetNode in datasetTree">
                        <ul>
                            <li>
                                <label>
                                    <input type="checkbox" 
                                        :value="datasetNode.item.subject" 
                                        v-model="selectedDatasets" 
                                        @change="toggleAllFeatures(datasetNode, $event.target.checked)"
                                    /> {{ datasetNode.item.object }}
                                </label>
                                <ul v-if="datasetNode.featureCollections.length > 0">
                                    <li v-for="fc in datasetNode.featureCollections">
                                        <label>
                                            <input type="checkbox"
                                                :value="fc.subject" 
                                                v-model="selectedFeaturesRef" 
                                            />{{ fc.object }}
                                        </label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <p />
                <button v-bind:disabled="shapeType == ShapeTypes.None" class="btn" type="submit">Search</button>
            </form>    

        </div>
        <div class="right-panel">
            <SearchMap @selectionUpdated="updateSelection" />            
        </div>
    </div>

<pre style="padding-left: 0;">
<b>Debug area</b>

- <button @click="fetchData">Fetch Data</button>

- Selected shape type = {{ shapeType }}

- Selected coords = <div style="white-space: normal;">{{  JSON.stringify(coords) }}</div>

</pre>

</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.search-form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    button[type="submit"] {
        align-self: flex-start;
    }
}

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

// <div class="query-option" data-v-c11b2e84=""><div class="query-option-title" data-v-c11b2e84="">Examples</div><div class="example-buttons" data-v-c11b2e84=""><button class="btn sm outline" data-v-c11b2e84="">Basic Select</button><button class="btn sm outline" data-v-c11b2e84="">Basic Construct</button><button class="btn sm outline" data-v-c11b2e84="">Concept Count</button><button class="btn sm outline" data-v-c11b2e84="">Feature Info</button></div></div>

</style>



<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";


.search-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
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

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* center the buttons horizontally */
  gap: 10px; /* set the spacing between the buttons */
}

.list {

    a.list-item {
        display: flex;
        flex-direction: row;
        gap: 10px;
        background-color: $cardBg;
        padding: 10px;
        border-radius: $borderRadius;

        .list-item-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;

            .list-item-title {
                margin: 0;
            }

            .list-item-desc {
                font-style: italic;
                color: grey;
                font-size: 0.8rem;
            }
        }

        .child-btn {
            align-self: baseline;
            flex-shrink: 0;
        }
    }
}
</style>