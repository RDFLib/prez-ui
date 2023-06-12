<script lang="ts" setup>
import { ref, onMounted, inject, computed } from "vue";

// the searchable map component and related map type definitions
import MapClient from "@/components/MapClient.vue";
import { AreaTypes, ShapeTypes, type Coords } from "@/components/MapClient.d";

// the pinia search store and related type definitions to manage the returned dataset tree
import { datasetsStore } from "@/stores/datasetsStore";
import type { DatasetTree, DatasetTreeNode } from "@/stores/datasetsStore.d"

// sparql query generation
import { mapSearchToSparql } from "@/util/mapSearchHelper"
import { mapConfigKey, type MapConfig } from "@/types";
import { convertConfigTypes } from "@/util/mapSearchHelper"

// a general button group component to render a set of buttons
import ButtonGroup from "@/components/ButtonGroup.vue";

// turn a list of enums into a a set of options for the button group
import { enumToOptions } from "@/util/mapSearchHelper"
import { mapSearchStore } from "@/stores/mapSearchStore";
import type { WKTResult } from "@/stores/mapSearchStore.d"
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import BaseModal from "@/components/BaseModal.vue";

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
const sparqlQueryRef = ref("")
const initialAreaTypeRef = ref(AreaTypes.Nearby)

const datasetCollapse = ref({} as {[key: string]: boolean});
const modal = ref<string | null>(null);

// to hold the wkt shape response from the map search
const responseRef = ref<WKTResult[]>()

const allDatasetsCollapsed = computed(() => {
    return Object.values(datasetCollapse.value).every(isCollapsed => isCollapsed);
});

const allDatasetsSelected = computed(() => {
    let allSelected = true;
    datasetTreeRef.value.forEach(dataset => {
        if (!selectedDatasetsRef.value.includes(dataset.item.subject)) {
            allSelected = false;
            return false;
        } else {
            if (!dataset.featureCollections.every(fc => selectedFeaturesRef.value.includes(fc.subject))) {
                allSelected = false;
                return false;
            }
        }
    });
    return allSelected;
});

/** Opens/collapses all datasets */
function toggleCollapseDatasets() {
    let collapsed: {[key: string]: boolean} = {};
    Object.keys(datasetCollapse.value).forEach(dataset => collapsed[dataset] = !allDatasetsCollapsed.value);
    datasetCollapse.value = collapsed;
}

function copySPARQL() {
    navigator.clipboard.writeText(sparqlQueryRef.value);
}

/** Selects/unselects all datasets & feature collections */
async function toggleSelectAll() {
    let selectedDatasets: string[] = [];
    let selectedFcs: string[] = [];
    if (!allDatasetsSelected.value) {
        datasetTreeRef.value.forEach(dataset => {
            selectedDatasets.push(dataset.item.subject);
            selectedFcs = [...selectedFcs, ...dataset.featureCollections.map(fc => fc.subject)];
        });
    }
    selectedDatasetsRef.value = selectedDatasets;
    selectedFeaturesRef.value = selectedFcs;

    await performMapSearch();
}

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
    if (mapSearch.success) {
        // responseRef is only updated to show in the debug window, if active
        responseRef.value = mapSearch.data
        // draw the shape onto the map
        searchMapRef.value.drawShape(mapSearch.data)
    }
}

/** get the data from the search store  */
const fetchData = async () => {
    await datasets.fetchSpacePrezData()
    if (datasets.success) {
        datasetTreeRef.value = datasets.getDatasetTree()
    }
}

// start off by loading the SPARQL query result data into the search store
onMounted(async () => {
    await fetchData()

    // start with all items selected
    datasetTreeRef.value.forEach(ds => {
        datasetCollapse.value[ds.item.subject] = true;
        selectedDatasetsRef.value.push(ds.item.subject)
        ds.featureCollections.forEach(fc => {
            selectedFeaturesRef.value.push(fc.subject)
        })
    })

})

// called when a selection has changed
const updateSelection = async (selectedCoords: Coords, shapeType: ShapeTypes) => {
    //shapeTypeRef.value = selectedCoords.length == 0 ? ShapeTypes.None : (selectedCoords.length == 1 ? ShapeTypes.Point : ShapeTypes.Polygon)
    shapeTypeRef.value = shapeType
    coordsRef.value = selectedCoords
    // only search when we have shape type provided
    if (shapeType != ShapeTypes.None) {
        if (shapeType == ShapeTypes.Point) {
            initialAreaTypeRef.value = AreaTypes.Nearby
            areaTypeRef.value = AreaTypes.Nearby
        } else {
            initialAreaTypeRef.value = AreaTypes.Contains
            areaTypeRef.value = AreaTypes.Contains
        }
        await performMapSearch()
    }
}

// convert out areatypes into a list of options format to show as buttons
const areaButtons = enumToOptions(AreaTypes)

// triggered when a change of area type has been clicked
const handleAreaButtonChange = async (values: AreaTypes[]) => {
    initialAreaTypeRef.value = values[0]
    areaTypeRef.value = values[0]
    await performMapSearch()
}

/** toggle selected features under a dataset */
const toggleAllFeatures = async (datasetNode: DatasetTreeNode, checked: boolean) => {
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
    <div class="spatial-search">
        <div class="search-options">
            <div class="search-form-container">
                <div class="search-form">
                    <div class="form-section">
                        <h4>Map Selection</h4>
                        <ButtonGroup
                            :initial-value="shapeTypeRef != ShapeTypes.None ? initialAreaTypeRef : undefined"
                            @change="handleAreaButtonChange"
                            :buttons="areaButtons"
                            :allowMultipleSelection="false"
                            :disabled="shapeTypeRef == ShapeTypes.None"
                        />
                        <div v-if="shapeTypeRef != ShapeTypes.None && areaTypeRef == AreaTypes.Nearby" style="padding-top: 10px; font-size: 0.7em">
                            within <input type="number" class="radius-input" v-model="radiusRef" @change="performMapSearch()" min="1" max="10000" /> km
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>Datasets &amp; Feature Collections</h4>
                        <div class="dataset-buttons">
                            <div class="select-all-input">
                                <input type="checkbox" name="select-all" id="select-all" @change="toggleSelectAll" v-model="allDatasetsSelected">
                                <label for="select-all">Select all</label>
                            </div>
                            <button class="btn outline sm" @click="toggleCollapseDatasets" title="Toggle collapse all datasets">
                                <template v-if="allDatasetsCollapsed">Expand all <i class="fa-regular fa-chevron-down"></i></template>
                                <template v-else>Collapse all <i class="fa-regular fa-chevron-up"></i></template>
                            </button>
                        </div>
                        <LoadingMessage v-if="datasets.loading" />
                        <ErrorMessage v-else-if="datasets.error" :message="`Unable to load datasets: ${datasets.error}`" />
                        <ul v-else class="dataset-options">
                            <li v-for="(dataset, dIndex) in datasetTreeRef" class="dataset-option">
                                <input type="checkbox" :id="`dataset-${dIndex}`" :value="dataset.item.subject" v-model="selectedDatasetsRef" @change="toggleAllFeatures(dataset, ($event.target as HTMLInputElement)?.checked)" />
                                <label :for="`dataset-${dIndex}`">{{ dataset.item.object }}</label>
                                <button
                                    class="btn outline sm dataset-collapse-btn"
                                    @click="datasetCollapse[dataset.item.subject] = !datasetCollapse[dataset.item.subject]"
                                    title="Toggle collapse this dataset"
                                >
                                    <i :class="`fa-regular fa-chevron-${datasetCollapse[dataset.item.subject] ? 'down' : 'up'}`"></i>
                                </button>
                                <ul v-if="dataset.featureCollections.length > 0" :class="`fc-options ${datasetCollapse[dataset.item.subject] ? 'collapse' : ''}`">
                                    <li v-for="(fc, fcIndex) in dataset.featureCollections" class="fc-option">
                                        <input type="checkbox" :id="`fc-${dIndex}-${fcIndex}`" :value="fc.subject" v-model="selectedFeaturesRef" @change="performMapSearch()" />
                                        <label :for="`fc-${dIndex}-${fcIndex}`">{{ fc.object }}</label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bottom-buttons">
                    <button class="btn outline" @click="modal = 'sparqlQuery'">Show Query <i class="fa-regular fa-code"></i></button>
                    <div class="right-buttons">
                        <div class="result-limit-input">
                            <label for="result-limit">Result limit</label>
                            <input id="result-limit" type="number" @change="performMapSearch()" v-model="limitRef" min="1" max="100">
                        </div>
                        <button class="btn" @click="performMapSearch()" :disabled="shapeTypeRef == ShapeTypes.None">Search <i class="fa-regular fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </div>
            <div class="search-map">
                <MapClient
                    ref="searchMapRef"
                    :geo-w-k-t="responseRef"
                    :drawing-modes="['MARKER', 'POLYGON', 'RECTANGLE']"
                    @selectionUpdated="updateSelection"
                />
            </div>
        </div>
        <div class="results">
            <h3>Results</h3>
            <LoadingMessage v-if="mapSearch.loading" />
            <ErrorMessage v-else-if="mapSearch.error" :message="mapSearch.error" />
            <table v-else-if="mapSearch.data && mapSearch.data.length > 0">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Feature Collection</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="result in mapSearch.data">
                        <tr>
                            <td><a :href="result.link">{{ result.label }}</a></td>
                            <td>{{ result.fcLabel }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div v-else>
                No results
            </div>
        </div>
    </div>
    <BaseModal v-if="modal === 'sparqlQuery'" @modalClosed="modal = null">
        <template #headerMiddle>Spatial Search SPARQL Query</template>
        <div class="sparql-query-content">
            <pre>{{ sparqlQueryRef.trim() }}</pre>
        </div>
        <template #footer>
            <button class="btn outline sparql-copy-btn" @click="copySPARQL" title="Copy SPARQL query">Copy <i class="fa-regular fa-copy"></i></button>
        </template>
    </BaseModal>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.spatial-search {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .search-options {
        display: grid;
        grid-template-columns: 2fr 3fr;
        // gap: 20px;

        .search-form-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
            background-color: var(--cardBg);
            border-radius: $borderRadius;
            height: 500px;

            .search-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
                flex-grow: 1;
                overflow-y: auto;

                .form-section {
                    display: flex;
                    flex-direction: column;

                    h4 {
                        margin: 0px 0px 10px 0px;
                    }

                    input.radius-input {
                        width: 70px;
                        font-size: 0.8rem;
                        padding: 4px;
                    }

                    .dataset-buttons {
                        display: flex;
                        flex-direction: row;
                        gap: 8px;
                        align-items: center;
                        margin-bottom: 12px;
                    }

                    ul.dataset-options {
                        padding-left: 0;
                        margin: 0;
                        
                        li.dataset-option {
                            list-style-type: none;
                            margin-bottom: 6px;

                            button.dataset-collapse-btn {
                                padding: 2px 3px;
                                margin-left: 4px;
                            }
                            
                            ul.fc-options {
                                overflow-y: hidden;
                                padding-left: 32px;
                                
                                &.collapse {
                                    height: 0;
                                }
                                
                                li.fc-option {
                                    list-style-type: none;
                                    margin-top: 4px;
                                }
                            }
                        }
                    }
                }
            }

            .bottom-buttons {
                display: flex;
                flex-direction: row;
                gap: 8px;
                justify-content: space-between;
                align-items: center;

                .right-buttons {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;

                    .result-limit-input {
                        display: flex;
                        flex-direction: row;
                        gap: 4px;
                        align-items: center;

                        input {
                            width: 60px;
                            padding: 6px;
                        }
                    }
                }
            }
        }
    }

    .results {
        h3 {
            margin-top: 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;

            thead {
                th {
                    padding: 10px;
                    background-color: #ccc;
                    text-align: center;
                }
            }

            tbody {
                td {
                    padding: 5px;
                    text-overflow: ellipsis;
                    // white-space: nowrap;
                }
            }

            tr:nth-child(2n) {
                background-color: var(--tableBg);
            }
        }
    }
}

.sparql-query-content {
    padding: 12px;

    pre {
        white-space: pre-wrap;
        margin: 0;
    }
}

.sparql-copy-btn {
    margin-left: auto;
}

@media (max-width: 1024px) {
    .search-options {
        grid-template-columns: 1fr !important;
    }
}
</style>