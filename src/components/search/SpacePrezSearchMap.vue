<script lang="ts" setup>
import { ref, computed, inject, onMounted, watch } from "vue";
import { DataFactory } from "n3";
import { mapConfigKey, type MapConfig, type ProfileHeader } from "@/types";
import { useUiStore } from "@/stores/ui";
import { useApiRequest, useConcurrentApiRequests, useSparqlRequest } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";
import { copyToClipboard } from "@/util/helpers";
import { AreaTypes, ShapeTypes, type Coords } from "@/components/MapClient.d";
import { enumToOptions } from "@/util/mapSearchHelper";
import MapClient from "@/components/MapClient.vue";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import BaseModal from "@/components/BaseModal.vue";
import ButtonGroup from "@/components/ButtonGroup.vue";
import { spatialSearchQuery } from "@/sparqlQueries/spatialSearch";

const { namedNode } = DataFactory;

type Option = {
    title?: string;
    iri: string;
};

const mapConfig = inject(mapConfigKey) as MapConfig;

const ui = useUiStore();
const { loading: datasetLoading, error: datasetError, apiGetRequest: datasetApiGetRequest } = useApiRequest(); // list of datasets
const { loading: fcLoading, hasError: fcError, concurrentApiRequests: fcConcurrentApiRequests } = useConcurrentApiRequests(); // concurrent lists of feature collections
const { loading: searchLoading, error: searchError, sparqlGetRequest: searchSparqlGetRequest } = useSparqlRequest(); // spatial search SPARQL query
const { store, parseIntoStore, qnameToIri } = useRdfStore();

const LIVE_SEARCH = true;
const DEFAULT_LABEL_PREDICATES = [qnameToIri("dcterms:title")];
const AREA_BUTTONS = enumToOptions(AreaTypes)

const datasets = ref<(Option & {link: string, featureCollections: Option[]})[]>([]);
const selectedDatasets = ref<string[]>([]);
const selectedFeatureCollections = ref<string[]>([]);
const shape = ref<{
    type: ShapeTypes;
    coords: Coords;
}>({
    type: ShapeTypes.None,
    coords: []
});
const spatialSelectionType = ref<AreaTypes>(AreaTypes.Nearby);
const showQuery = ref(false);
const limit = ref(10);
const radius = ref(5);
const results = ref([]);
const datasetCollapse = ref<{[key: string]: boolean}>({});

const allDatasetsCollapsed = computed(() => {
    return Object.values(datasetCollapse.value).every(isCollapsed => isCollapsed);
});

const allDatasetsSelected = computed(() => {
    let allSelected = true;
    datasets.value.forEach(dataset => {
        if (!selectedDatasets.value.includes(dataset.iri)) {
            allSelected = false;
            return false;
        } else {
            if (!dataset.featureCollections.every(fc => selectedFeatureCollections.value.includes(fc.iri))) {
                allSelected = false;
                return false;
            }
        }
    });
    return allSelected;
});

const query = computed(() => {
    return spatialSearchQuery(
        selectedFeatureCollections.value,
        shape.value.coords,
        spatialSelectionType.value,
        radius.value,
        limit.value,
        mapConfig.search
    );
});

function toggleAllDatasets() {
    let selectedDs: string[] = [];
    let selectedFcs: string[] = [];
    if (!allDatasetsSelected.value) {
        datasets.value.forEach(dataset => {
            selectedDs.push(dataset.iri);
            selectedFcs = [...selectedFcs, ...dataset.featureCollections.map(fc => fc.iri)];
        });
    }
    selectedDatasets.value = selectedDs;
    selectedFeatureCollections.value = selectedFcs;
}

function toggleFeatureCollections(dataset: (Option & {link: string, featureCollections: Option[]}), checked: boolean) {
    if (checked) {
        dataset.featureCollections.forEach(fc => {
            if (!selectedFeatureCollections.value.includes(fc.iri)) {
                selectedFeatureCollections.value.push(fc.iri);
            }
        });
    } else {
        // If it's unchecked, remove all feature collections from selectedFeatureCollections    
        dataset.featureCollections.forEach(fc => {
            const index = selectedFeatureCollections.value.indexOf(fc.iri);
            if (index >= 0) {
                selectedFeatureCollections.value.splice(index, 1);
            }
        });
    }
}

function toggleCollapseAllDatasets() {
    let collapsed: {[key: string]: boolean} = {};
    Object.keys(datasetCollapse.value).forEach(dataset => collapsed[dataset] = !allDatasetsCollapsed.value);
    datasetCollapse.value = collapsed;
}

function handleSpatialSelectionChange(values: AreaTypes[]) {
    spatialSelectionType.value = values[0];
}

function handleMapSelectionChange(selectedCoords: Coords, shapeType: ShapeTypes) {
    shape.value = {
        type: shapeType,
        coords: selectedCoords
    };

    if (shapeType != ShapeTypes.None) {
        if (shapeType == ShapeTypes.Point) {
            spatialSelectionType.value = AreaTypes.Nearby;
        } else {
            spatialSelectionType.value = AreaTypes.Contains;
        }
    }
}

/**
 * Gets the list of Datasets from the API endpoint `/s/datasets` & creates the list of dataset options
 */
async function getDatasets() {
    const { data, profiles } = await datasetApiGetRequest("/s/datasets");
    if (data && profiles.length > 0 && !datasetError.value) {
        const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
        const labelPredicates = defaultProfile.labelPredicates.length > 0 ? defaultProfile.labelPredicates : DEFAULT_LABEL_PREDICATES;

        parseIntoStore(data);

        const datasetOptions: {[key: string]: (Option & {link: string, featureCollections: Option[]})} = {};

        store.value.forSubjects(subject => {
            const dataset: (Option & {link: string, featureCollections: Option[]}) = {
                iri: subject.value,
                link: "",
                featureCollections: []
            };

            store.value.forEach(q => {
                if (labelPredicates.includes(q.predicate.value)) {
                    dataset.title = q.object.value;
                } else if (q.predicate.value === qnameToIri("prez:link")) {
                    dataset.link = q.object.value;
                }
            }, subject, null, null, null);

            datasetOptions[subject.value] = dataset;
        }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Dataset")), null);

        const fcData = await fcConcurrentApiRequests(Object.values(datasetOptions).map(d => `${d.link}/collections`));
        let fcProfiles: ProfileHeader[] = [];

        fcData.forEach((r, index) => {
            if (r.value) {
                parseIntoStore(r.value);
            }
            if (index === 0 && r.profiles) {
                fcProfiles = r.profiles;
            }
        });

        const fcDefaultProfile = ui.profiles[fcProfiles.find(p => p.default)!.uri];
        const fcLabelPredicates = fcDefaultProfile.labelPredicates.length > 0 ? fcDefaultProfile.labelPredicates : DEFAULT_LABEL_PREDICATES;

        store.value.forSubjects(subject => { // get datasets
            store.value.forObjects(object => { // get fcs per dataset
                const fc: Option = {
                    iri: object.value
                };
                store.value.forEach(q => { // fc triples
                    if (fcLabelPredicates.includes(q.predicate.value)) {
                        fc.title = q.object.value;
                    }
                }, object, null, null, null);
                datasetOptions[subject.value].featureCollections.push(fc);
            }, subject, namedNode(qnameToIri("rdfs:member")), null);

            // sort by title first, then by IRI if no title
            datasetOptions[subject.value].featureCollections.sort((a, b) => {
                if (a.title && b.title) {
                    return a.title.localeCompare(b.title);
                } else if (a.title) {
                    return -1;
                } else if (b.title) {
                    return 1;
                } else {
                    return a.iri.localeCompare(b.iri);
                }
            });
        }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Dataset")), null);

        // sort by title first, then by IRI if no title
        datasets.value = Object.values(datasetOptions).sort((a, b) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title);
            } else if (a.title) {
                return -1;
            } else if (b.title) {
                return 1;
            } else {
                return a.iri.localeCompare(b.iri);
            }
        });
    }
}

async function doSearch() {
    
}

onMounted(async () => {
    await getDatasets();

    // select all by default
    datasets.value.forEach(dataset => {
        datasetCollapse.value[dataset.iri] = true;
        selectedDatasets.value.push(dataset.iri);
        dataset.featureCollections.forEach(fc => {
            selectedFeatureCollections.value.push(fc.iri);
        });
    });
})
</script>

<template>
    <div class="spatial-search">
        <div class="search-options">
            <div class="search-form-container">
                <div class="search-form">
                    <div class="form-section">
                        <h4>Map Selection</h4>
                        <ButtonGroup
                            :initial-value="shape.type !== ShapeTypes.None ? spatialSelectionType : undefined"
                            @change="handleSpatialSelectionChange"
                            :buttons="AREA_BUTTONS"
                            :allowMultipleSelection="false"
                            :disabled="shape.type === ShapeTypes.None"
                        />
                        <div v-if="shape.type !== ShapeTypes.None && spatialSelectionType == AreaTypes.Nearby" style="padding-top: 10px; font-size: 0.7em">
                            within <input type="number" class="radius-input" v-model="radius" min="1" max="10000" /> km
                        </div>
                    </div>
                    <div class="form-section">
                        <h4>Datasets &amp; Feature Collections</h4>
                        <div class="dataset-buttons">
                            <div class="select-all-input">
                                <input type="checkbox" name="select-all" id="select-all" @change="toggleAllDatasets" :checked="allDatasetsSelected">
                                <label for="select-all">Select all</label>
                            </div>
                            <button class="btn outline sm" @click="toggleCollapseAllDatasets" title="Toggle collapse all datasets">
                                <template v-if="allDatasetsCollapsed">Expand all <i class="fa-regular fa-chevron-down"></i></template>
                                <template v-else>Collapse all <i class="fa-regular fa-chevron-up"></i></template>
                            </button>
                        </div>
                        <LoadingMessage v-if="datasetLoading" />
                        <ErrorMessage v-else-if="datasetError" :message="`Unable to load datasets: ${datasetError}`" />
                        <ul v-else class="dataset-options">
                            <li v-for="(dataset, dIndex) in datasets" class="dataset-option">
                                <input type="checkbox" :id="`dataset-${dIndex}`" :value="dataset.iri" v-model="selectedDatasets" @change="toggleFeatureCollections(dataset, ($event.target as HTMLInputElement)?.checked)" />
                                <label :for="`dataset-${dIndex}`">{{ dataset.title || dataset.iri }}</label>
                                <button
                                    class="btn outline sm dataset-collapse-btn"
                                    @click="datasetCollapse[dataset.iri] = !datasetCollapse[dataset.iri]"
                                    title="Toggle collapse this dataset"
                                >
                                    <i :class="`fa-regular fa-chevron-${datasetCollapse[dataset.iri] ? 'down' : 'up'}`"></i>
                                </button>
                                <ul v-if="dataset.featureCollections.length > 0" :class="`fc-options ${datasetCollapse[dataset.iri] ? 'collapse' : ''}`">
                                    <li v-for="(fc, fcIndex) in dataset.featureCollections" class="fc-option">
                                        <input type="checkbox" :id="`fc-${dIndex}-${fcIndex}`" :value="fc.iri" v-model="selectedFeatureCollections" />
                                        <label :for="`fc-${dIndex}-${fcIndex}`">{{ fc.title || fc.iri }}</label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bottom-buttons">
                    <button class="btn outline" @click="showQuery = true">Show Query <i class="fa-regular fa-code"></i></button>
                    <div class="right-buttons">
                        <div class="result-limit-input">
                            <label for="result-limit">Result limit</label>
                            <input id="result-limit" type="number" v-model="limit" min="1" max="100">
                        </div>
                        <button class="btn" @click="doSearch()" :disabled="shape.type == ShapeTypes.None">Search <i class="fa-regular fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </div>
            <div class="search-map">
                <MapClient
                    ref="searchMapRef"
                    :geo-w-k-t="results"
                    :drawing-modes="['MARKER', 'POLYGON', 'RECTANGLE']"
                    @selectionUpdated="handleMapSelectionChange"
                />
            </div>
        </div>
        <div class="results">
            <h3>Results</h3>
            <LoadingMessage v-if="searchLoading" />
            <ErrorMessage v-else-if="searchError" :message="searchError" />
            <table v-else-if="results.length > 0">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Feature Collection</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="result in results">
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
    <BaseModal v-if="showQuery" @modalClosed="showQuery = false">
        <template #headerMiddle>Spatial Search SPARQL Query</template>
        <div class="sparql-query-content">
            <pre>{{ query.trim() }}</pre>
        </div>
        <template #footer>
            <button class="btn outline sparql-copy-btn" @click="copyToClipboard(query)" title="Copy SPARQL query">Copy <i class="fa-regular fa-copy"></i></button>
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