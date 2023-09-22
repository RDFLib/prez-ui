<script lang="ts" setup>
import { onMounted, ref, watch, computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { DataFactory, type Literal } from "n3";
import type { ProfileHeader, languageLabel, option, SearchItem, selectOption, treeSelectOption } from "@/types";
import type { WKTResult } from "@/components/MapClient.d";
import { useUiStore } from "@/stores/ui";
import { useApiRequest, useConcurrentApiRequests } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";
import router from "@/router";
import { sortByTitle, getLanguagePriority, allOptionsSelected, ensureProfiles, getLink } from "@/util/helpers";
import SearchResult from "@/components/search/SearchResult.vue";
import MapClient from "@/components/MapClient.vue";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import TreeSelect from "@bosquig/vue3-treeselect";

const { namedNode } = DataFactory;

const route = useRoute();
const ui = useUiStore();
const { loading, error, apiGetRequest } = useApiRequest(); // search request
const { store, parseIntoStore, qnameToIri, clearStore } = useRdfStore(); // search results store
const { loading: catalogLoading, error: catalogError, apiGetRequest: catalogApiGetRequest } = useApiRequest(); // catalog request
const { loading: datasetLoading, error: datasetError, apiGetRequest: datasetApiGetRequest } = useApiRequest(); // dataset request
const { loading: fcLoading, hasError: fcError, concurrentApiRequests: fcConcurrentApiRequests } = useConcurrentApiRequests(); // feature collections request
const { loading: vocabLoading, error: vocabError, apiGetRequest: vocabApiGetRequest } = useApiRequest(); // vocab request
const { loading: collectionLoading, error: collectionError, apiGetRequest: collectionApiGetRequest } = useApiRequest(); // collection request
const { store: optionsStore, parseIntoStore: optionParseIntoStore, qnameToIri: optionQnameToIri } = useRdfStore(); // options store

const DEFAULT_LABEL_PREDICATES = [
    qnameToIri("rdfs:label"),
    qnameToIri("dcterms:title"),
    qnameToIri("skos:prefLabel"),
    qnameToIri("sdo:name"),
];
const DEFAULT_DESC_PREDICATES = [
    qnameToIri("dcterms:description"),
    qnameToIri("skos:definition"),
    qnameToIri("sdo:description"),
];
const SEARCH_METHOD = "default";
const BASE_CLASSES: selectOption[] = [
    {
        id: optionQnameToIri("dcat:Catalog"),
        label: "Catalog",
    },
    {
        id: optionQnameToIri("skos:Collection"),
        label: "Collection",
    },
    {
        id: optionQnameToIri("skos:Concept"),
        label: "Concept",
    },
    {
        id: optionQnameToIri("skos:ConceptScheme"),
        label: "Concept Scheme",
    },
    {
        id: optionQnameToIri("dcat:Dataset"),
        label: "Dataset",
    },
    {
        id: optionQnameToIri("geo:Feature"),
        label: "Feature",
    },
    {
        id: optionQnameToIri("geo:FeatureCollection"),
        label: "Feature Collection",
    },
    {
        id: optionQnameToIri("dcat:Resource"),
        label: "Resource",
    },
];
const CONTAINER_RELATIONS: { [key: string]: { predicate: string; inbound: boolean; } } = {
    "dcat:Dataset": {
        predicate: "rdfs:member",
        inbound: true
    },
    "dcat:Catalog": {
        predicate: "dcterms:hasPart",
        inbound: true
    },
    "skos:ConceptScheme": {
        predicate: "skos:inScheme",
        inbound: false
    },
    "skos:Collection": {
        predicate: "skos:member",
        inbound: true
    },
};

const options = ref<{
    containers: {
        dataset: treeSelectOption[];
        catalog: selectOption[];
        vocab: selectOption[];
        collection: selectOption[];
    };
    baseClasses: selectOption[];
}>({
    containers: {
        dataset: [],
        catalog: [],
        vocab: [],
        collection: [],
    },
    baseClasses: BASE_CLASSES
});
const data = ref<{
    term: string;
    limit: number;
    containers: {
        // dataset: {[key: string]: string[]}, // {datasetIRI: [fcIRI, ...], ...}
        dataset: string[], // {datasetIRI: [fcIRI, ...], ...}
        catalog: string[],
        vocab: string[],
        collection: string[],
    },
    baseClasses: string[],
    outbound: {predicate: string; value: string;}[],
    inbound: {predicate: string; value: string;}[]
}>({
    term: "",
    limit: 10,
    containers: {
        // dataset: {},
        dataset: [],
        catalog: [],
        vocab: [],
        collection: [],
    },
    baseClasses: [],
    outbound: [],
    inbound: []
});
const collapse = ref(false);
const results = ref<SearchItem[]>([]);
const geoResults = ref<WKTResult[]>([]);

function getCatalogs() {
    catalogApiGetRequest("/c/catalogs").then(r => {
        const { data: catalogData, profiles } = r;
        if (data && profiles.length > 0) {
            const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
            const labelPredicates = defaultProfile!.labelPredicates.length > 0 ? defaultProfile!.labelPredicates : DEFAULT_LABEL_PREDICATES;

            optionParseIntoStore(catalogData);
            const catalogOptions: selectOption[] = [];

            optionsStore.value.forSubjects(subject => {
                if (!subject.value.endsWith("/system/catprez")) { // hide system catalog
                    const catalog: selectOption = {
                        id: subject.value
                    } as selectOption;

                    const labels: languageLabel[] = [];

                    optionsStore.value.forEach(q => {
                        if (labelPredicates.includes(q.predicate.value)) {
                            let language = (q.object as Literal).language;
                            labels.push({
                                value: q.object.value,
                                language: language || undefined,
                                priority: getLanguagePriority(language)
                            });
                        }
                    }, subject, null, null, null);

                    labels.sort((a, b) => a.priority - b.priority);
                    catalog.label = labels.length > 0 ? labels[0].value : catalog.id;

                    catalogOptions.push(catalog);
                }
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Catalog")), null);

            // catalogOptions.sort(sortByTitle);
            options.value.containers.catalog = catalogOptions;
            // data.value.containers.catalog = catalogOptions.map(c => c.id);
        }
    });
}

function getDatasets() {
    datasetApiGetRequest("/s/datasets").then(async r => {
        const { data: datasetData, profiles } = r;
        if (data && profiles.length > 0) {
            const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
            const labelPredicates = defaultProfile!.labelPredicates.length > 0 ? defaultProfile!.labelPredicates : DEFAULT_LABEL_PREDICATES;

            optionParseIntoStore(datasetData);
            const datasetOptions: { [key: string]: treeSelectOption & { link: string } } = {};

            optionsStore.value.forSubjects(subject => {
                const dataset: treeSelectOption & { link: string } = {
                    id: subject.value,
                    label: subject.value,
                    link: "",
                    children: []
                };

                const labels: languageLabel[] = [];

                    optionsStore.value.forEach(q => {
                        if (labelPredicates.includes(q.predicate.value)) {
                            let language = (q.object as Literal).language;
                            labels.push({
                                value: q.object.value,
                                language: language || undefined,
                                priority: getLanguagePriority(language)
                            });
                        } else if (q.predicate.value === optionQnameToIri("prez:link")) {
                            dataset.link = q.object.value;
                        }
                    }, subject, null, null, null);

                    labels.sort((a, b) => a.priority - b.priority);
                    dataset.label = labels.length > 0 ? labels[0].value : dataset.id;

                datasetOptions[dataset.id] = dataset;
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Dataset")), null);

            const fcResults = await fcConcurrentApiRequests(Object.values(datasetOptions).map(d => `${d.link}/collections`));
            let fcProfiles: ProfileHeader[] = [];
            fcResults.forEach((r, index) => {
                if (r.value) {
                    optionParseIntoStore(r.value);
                }
                if (index === 0 && r.profiles) {
                    fcProfiles = r.profiles;
                }
            });

            const fcDefaultProfile = ui.profiles[fcProfiles.find(p => p.default)!.uri];
            const fcLabelPredicates = fcDefaultProfile.labelPredicates.length > 0 ? fcDefaultProfile.labelPredicates : DEFAULT_LABEL_PREDICATES;

            optionsStore.value.forSubjects(subject => {
                optionsStore.value.forObjects(object => {
                    const fc: treeSelectOption = {
                        id: object.value,
                        label: object.value
                    };
                    const labels: languageLabel[] = [];
                    optionsStore.value.forEach(q => { // fc triples
                        if (fcLabelPredicates.includes(q.predicate.value)) {
                            let language = (q.object as Literal).language;
                            labels.push({
                                value: q.object.value,
                                language: language || undefined,
                                priority: getLanguagePriority(language)
                            });
                        }
                    }, object, null, null, null);
                    labels.sort((a, b) => a.priority - b.priority);
                    fc.label = labels.length > 0 ? labels[0].value : fc.id;
                    datasetOptions[subject.value].children?.push(fc);
                }, subject, optionQnameToIri("rdfs:member"), null);

                // sort fcs
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Dataset")), null);

            // datasetOptions.sort(sortByTitle);
            options.value.containers.dataset = Object.values(datasetOptions).map(d => {
                return {
                    id: d.id,
                    label: d.label,
                    children: d.children
                };
            });
            // data.value.containers.dataset = datasetOptions.map(c => c.id);
        }
    });
}

function getVocabs() {
    vocabApiGetRequest("/v/vocab").then(r => {
        const { data: vocabData, profiles } = r;
        if (data && profiles.length > 0) {
            const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
            const labelPredicates = defaultProfile!.labelPredicates.length > 0 ? defaultProfile!.labelPredicates : DEFAULT_LABEL_PREDICATES;

            optionParseIntoStore(vocabData);
            const vocabOptions: selectOption[] = [];

            optionsStore.value.forSubjects(subject => {
                const vocab: selectOption = {
                    id: subject.value
                } as selectOption;

                const labels: languageLabel[] = [];

                optionsStore.value.forEach(q => {
                    if (labelPredicates.includes(q.predicate.value)) {
                        let language = (q.object as Literal).language;
                        labels.push({
                            value: q.object.value,
                            language: language || undefined,
                            priority: getLanguagePriority(language)
                        });
                    }
                }, subject, null, null, null);

                labels.sort((a, b) => a.priority - b.priority);
                vocab.label = labels.length > 0 ? labels[0].value : vocab.id;

                vocabOptions.push(vocab);
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("skos:ConceptScheme")), null);

            // vocabOptions.sort(sortByTitle);
            options.value.containers.vocab = vocabOptions;
            // data.value.containers.vocab = vocabOptions.map(c => c.id);
        }
    });
}

function getCollections() {
    collectionApiGetRequest("/v/collection").then(r => {
        const { data: collectionData, profiles } = r;
        if (data && profiles.length > 0) {
            const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
            const labelPredicates = defaultProfile!.labelPredicates.length > 0 ? defaultProfile!.labelPredicates : DEFAULT_LABEL_PREDICATES;

            optionParseIntoStore(collectionData);
            const collectionOptions: selectOption[] = [];

            optionsStore.value.forSubjects(subject => {
                const collection: selectOption = {
                    id: subject.value
                } as selectOption;

                const labels: languageLabel[] = [];

                optionsStore.value.forEach(q => {
                    if (labelPredicates.includes(q.predicate.value)) {
                        let language = (q.object as Literal).language;
                        labels.push({
                            value: q.object.value,
                            language: language || undefined,
                            priority: getLanguagePriority(language)
                        });
                    }
                }, subject, null, null, null);

                labels.sort((a, b) => a.priority - b.priority);
                collection.label = labels.length > 0 ? labels[0].value : collection.id;

                collectionOptions.push(collection);
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("skos:Collection")), null);

            // collectionOptions.sort(sortByTitle);
            options.value.containers.collection = collectionOptions;
            // data.value.containers.collection = collectionOptions.map(c => c.id);
        }
    });
}

function formToQueryString(): string {
    let queryList: string[] = [];

    // term
    if (data.value.term !== "") {
        queryList.push(`term=${encodeURIComponent(data.value.term)}`);
    }

    // method
    queryList.push(`method=${SEARCH_METHOD}`);

    // limit
    queryList.push(`limit=${data.value.limit}`);

    // if some classes are selected
    if (data.value.baseClasses.length > 0) {
        queryList.push(`focus-to-filter[rdf:type]=${data.value.baseClasses.map(c => encodeURIComponent(c)).join(",")}`);
    }

    // if not all containers are selected
        if (data.value.containers.catalog.length > 0) {
            queryList.push(`${CONTAINER_RELATIONS["dcat:Catalog"].inbound ? 'filter-to-focus' : 'focus-to-filter'}[${CONTAINER_RELATIONS["dcat:Catalog"].predicate}]=${data.value.containers.catalog.map(c => encodeURIComponent(c)).join(",")}`);
        }
        if (data.value.containers.dataset.length > 0) {
            queryList.push(`${CONTAINER_RELATIONS["dcat:Dataset"].inbound ? 'filter-to-focus' : 'focus-to-filter'}[${CONTAINER_RELATIONS["dcat:Dataset"].predicate}]=${data.value.containers.dataset.map(d => encodeURIComponent(d)).join(",")}`);
        }
        if (data.value.containers.vocab.length > 0) {
            queryList.push(`${CONTAINER_RELATIONS["skos:ConceptScheme"].inbound ? 'filter-to-focus' : 'focus-to-filter'}[${CONTAINER_RELATIONS["skos:ConceptScheme"].predicate}]=${data.value.containers.vocab.map(c => encodeURIComponent(c)).join(",")}`);
        }
        if (data.value.containers.collection.length > 0) {
            queryList.push(`${CONTAINER_RELATIONS["skos:Collection"].inbound ? 'filter-to-focus' : 'focus-to-filter'}[${CONTAINER_RELATIONS["skos:Collection"].predicate}]=${data.value.containers.collection.map(c => encodeURIComponent(c)).join(",")}`);
        }

    // outbound
    if (data.value.outbound.length > 0) {
        data.value.outbound.forEach(o => {
            queryList.push(`focus-to-filter[${encodeURIComponent(o.predicate)}]=${encodeURIComponent(o.value)}`);
        });
    }

    // inbound
    if (data.value.inbound.length > 0) {
        data.value.inbound.forEach(i => {
            queryList.push(`filter-to-focus[${encodeURIComponent(i.predicate)}]=${encodeURIComponent(i.value)}`);
        });
    }

    return `?${queryList.join("&")}`;
}

function queryStringToForm() {
    console.log("parsing query string...")
}

function reset() {
    // reset state
    error.value = "";
    loading.value = false;
    results.value = [];
    geoResults.value = [];
    clearStore();
}

async function submit() {
    reset();

    const query = formToQueryString();
    console.log(query)
    // router.push(`/search${query}`)
    const { data, profiles } = await apiGetRequest(`/search${query}`);
    console.log(data)
    if (data && profiles.length > 0 && !error.value) {
        const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
        const labelPredicates = defaultProfile!.labelPredicates.length > 0 ? defaultProfile!.labelPredicates : DEFAULT_LABEL_PREDICATES;
        const descPredicates = defaultProfile!.descriptionPredicates.length > 0 ? defaultProfile!.descriptionPredicates : DEFAULT_DESC_PREDICATES;
        
        parseIntoStore(data);

        const tempResults: SearchItem[] = [];

        store.value.forSubjects(subject => {
            const result: SearchItem = {
                weight: 0,
                uri: "",
                title: "",
                links: [],
                description: "",
                types: []
            };

            store.value.forEach(q => {
                if (q.predicate.value === qnameToIri("prez:searchResultWeight")) {
                    result.weight = Number(q.object.value);
                } else if (q.predicate.value === qnameToIri("prez:searchResultURI")) {
                    result.uri = q.object.value;
                    const labels: languageLabel[] = [];
                    let resultCoordinates = undefined;
                    store.value.forEach(q1 => {
                        if (q1.predicate.value === qnameToIri("prez:link")) {
                            let link = getLink(store.value, q1);
                            if (link) {
                                result.links.push(link);
                            }
                        } else if (labelPredicates.includes(q1.predicate.value)) {
                            let language = (q1.object as Literal).language;
                            labels.push({
                                value: q1.object.value,
                                language: language || undefined,
                                priority: getLanguagePriority(language)
                            });
                        } else if (descPredicates.includes(q1.predicate.value)) {
                            result.description = q1.object.value;
                        } else if (q1.predicate.value === qnameToIri("a")) {
                            const typeLabel = store.value.getObjects(q1.object, namedNode(qnameToIri("rdfs:label")), null);
                            result.types.push({
                                uri: q1.object.value,
                                label: typeLabel.length > 0 ? typeLabel[0].value : undefined,
                            });
                        } else if (q1.predicate.value === qnameToIri("geo:hasGeometry")) {
                            store.value.forEach(geometryTriple => {
                                resultCoordinates = geometryTriple.object.value;
                            }, q1.object, namedNode(qnameToIri("geo:asWKT")), null, null);
                        }
                    }, q.object, null, null, null);
                    labels.sort((a, b) => a.priority - b.priority);
                    result.title = labels.length > 0 ? labels[0].value : undefined;
                    if (resultCoordinates) {
                        geoResults.value.push({
                            uri: result.uri,
                            link: `/object?uri=${result.uri}`,
                            label: result.title ? result.title : result.uri,
                            fcLabel: "",
                            wkt: resultCoordinates
                        });
                    }
                }
            }, subject, null, null, null);

            console.log(result);
            tempResults.push(result);
        }, namedNode(qnameToIri("a")), namedNode(qnameToIri("prez:SearchResult")), null);
        
        // filter out duplicate URIs, keep highest weight?

        tempResults.sort((a, b) => b.weight - a.weight);
        results.value = tempResults;
    }
}

async function getResults() {
    // API call
    console.log("sending query to API...")
    console.log(route.fullPath)
    const { data } = await apiGetRequest(route.fullPath);
}

// watch(() => route.query, async (newValue, oldValue) => {
//     if (Object.keys(newValue).length > 0 && newValue !== oldValue) {
//         queryStringToForm();
//         await getResults();
//     }
// }, { deep: true });

onBeforeMount(() => {
    // filling out treeselects needs to be done before mounting
    // parse QSAs here and fill out form
});

onMounted(async () => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Advanced Search | Prez";
    ui.pageHeading = { name: "Prez", url: "/" };
    ui.breadcrumbs = [{ name: "Advanced Search", url: "/search" }];

    // data.value.baseClasses = options.value.baseClasses.map(c => c.id);

    await ensureProfiles();

    // get form options
    getCatalogs();
    getDatasets();
    getVocabs();
    getCollections();

    // if (Object.keys(route.query).length > 0) {
    //     queryStringToForm();
    //     await getResults();
    // }
});
</script>

<template>
    <h1 class="page-title">Advanced Search</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id eum quasi exercitationem neque, obcaecati maiores, rerum culpa magni nisi aperiam recusandae. Provident quae illo nam vero necessitatibus placeat debitis officia.</p>
    <div class="search-form">
        <div class="span-x-2">
            <div class="top-form-section">
                <div class="search-bar">
                    <input type="search" name="" id="" placeholder="Search..." v-model="data.term" @keyup.enter="submit">
                    <button v-if="collapse" class="btn" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
                <button class="collapse-btn btn outline sm" @click="collapse = !collapse">
                    <template v-if="collapse">
                        Expand
                        <i class="fa-solid fa-chevron-down"></i>
                    </template>
                    <template v-else>
                        Collapse
                        <i class="fa-solid fa-chevron-up"></i>
                    </template>
                </button>
            </div>
        </div>
        <div v-if="!collapse" class="form-section">
            <div class="section-title">
                <h4>Base Classes</h4>
                <Tooltip>
                    <span><i class="fa-regular fa-circle-question"></i></span>
                    <template #popper>Object types</template>
                </Tooltip>
            </div>
            <div class="section-body">
                <TreeSelect
                    v-model="data.baseClasses"
                    :options="options.baseClasses"
                    multiple
                    clearable
                />
            </div>
        </div>
        <div v-if="!collapse"></div>
        <div v-if="!collapse" class="form-section span-x-2 span-y-2">
            <div class="section-title">
                <h4>Containers</h4>
                <Tooltip>
                    <span><i class="fa-regular fa-circle-question"></i></span>
                    <template #popper>Filter by items within these objects</template>
                </Tooltip>
            </div>
            <div class="section-body containers">
                <div class="form-section">
                    <div class="section-title">
                        <label for="catalog-all">
                            <h5>Catalogs</h5>
                        </label>
                        <Tooltip>
                            <span><i class="fa-regular fa-circle-question"></i></span>
                            <template #popper>Catalogs</template>
                        </Tooltip>
                    </div>
                    <div class="section-body">
                        <ErrorMessage v-if="catalogError" :message="catalogError" />
                        <LoadingMessage v-else-if="catalogLoading" />
                        <TreeSelect
                            v-else
                            v-model="data.containers.catalog"
                            :options="options.containers.catalog"
                            multiple
                            clearable
                        />
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-title">
                        <label for="dataset-all">
                            <h5>Datasets</h5>
                        </label>
                        <Tooltip>
                            <span><i class="fa-regular fa-circle-question"></i></span>
                            <template #popper>Datasets</template>
                        </Tooltip>
                    </div>
                    <div class="section-body">
                        <ErrorMessage v-if="datasetError" :message="datasetError" />
                        <LoadingMessage v-else-if="datasetLoading || fcLoading" />
                        <TreeSelect
                            v-else
                            v-model="data.containers.dataset"
                            :options="options.containers.dataset"
                            multiple
                            clearable
                            flat
                        />
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-title">
                        <label for="vocab-all">
                            <h5>Vocabularies</h5>
                        </label>
                        <Tooltip>
                            <span><i class="fa-regular fa-circle-question"></i></span>
                            <template #popper>Vocabularies</template>
                        </Tooltip>
                    </div>
                    <div class="section-body">
                        <ErrorMessage v-if="vocabError" :message="vocabError" />
                        <LoadingMessage v-else-if="vocabLoading" />
                        <TreeSelect
                            v-else
                            v-model="data.containers.vocab"
                            :options="options.containers.vocab"
                            multiple
                            clearable
                        />
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-title">
                        <label for="collection-all">
                            <h5>Collections</h5>
                        </label>
                        <Tooltip>
                            <span><i class="fa-regular fa-circle-question"></i></span>
                            <template #popper>Collections</template>
                        </Tooltip>
                    </div>
                    <div class="section-body">
                        <ErrorMessage v-if="collectionError" :message="collectionError" />
                        <LoadingMessage v-else-if="collectionLoading" />
                        <TreeSelect
                            v-else
                            v-model="data.containers.collection"
                            :options="options.containers.collection"
                            multiple
                            clearable
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!collapse" class="form-section">
            <div class="section-title">
                <h4>Outbound Properties</h4>
                <Tooltip>
                    <span><i class="fa-regular fa-circle-question"></i></span>
                    <template #popper>Properties of the item you're searching for.</template>
                </Tooltip>
            </div>
            <div class="section-body">
                <div v-for="(property, index) in data.outbound" class="custom-property">
                    <input type="text" name="" id="" placeholder="Predicate" v-model="property.predicate">
                    <input type="text" name="" id="" placeholder="Value" v-model="property.value">
                    <button class="btn outline delete-btn ml-auto" @click="data.outbound.splice(index, 1)"><i class="fa-solid fa-trash"></i></button>
                </div>
                <button class="btn outline align-self-start" @click="data.outbound.push({predicate: '', value: ''})">+ Add Property Filter</button>
            </div>
        </div>
        <div v-if="!collapse" class="form-section">
            <div class="section-title">
                <h4>Inbound Properties</h4>
                <Tooltip>
                    <span><i class="fa-regular fa-circle-question"></i></span>
                    <template #popper>Relational properties that point to this item.</template>
                </Tooltip>
            </div>
            <div class="section-body">
                <div v-for="(property, index) in data.inbound" class="custom-property">
                    <input type="text" name="" id="" placeholder="Predicate" v-model="property.predicate">
                    <input type="text" name="" id="" placeholder="Value" v-model="property.value">
                    <button class="btn outline delete-btn ml-auto" @click="data.inbound.splice(index, 1)"><i class="fa-solid fa-trash"></i></button>
                </div>
                <button class="btn outline align-self-start" @click="data.inbound.push({predicate: '', value: ''})">+ Add Property Filter</button>
            </div>
        </div>
        <div v-if="!collapse" class="span-x-2 form-bottom">
            <div class="limit-input">
                <label for="">Limit</label>
                <input type="number" v-model="data.limit" name="" id="" min="1" max="100">
            </div>
            <button class="btn lg" type="submit" @click="submit">Search <i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
    </div>
    <h2>Results<span v-if="results.length > 0"> ({{ results.length }})</span></h2>
    <ErrorMessage v-if="error" :message="error" />
    <LoadingMessage v-else-if="loading"/>
    <template v-else>
        <div v-if="results.length > 0" class="results-grid">
            <div class="results">
                <SearchResult v-for="result in results" v-bind="result" />
            </div>
            <div v-if="geoResults.length > 0" class="map-container">
                <h4>Spatial Results</h4>
                <MapClient ref="searchMap" :geoWKT="geoResults" />
            </div>
        </div>
        <p v-else-if="results.length === 0">No results found.</p>
    </template>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.search-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    background-color: var(--cardBg);
    padding: 12px;
    border-radius: $borderRadius;
    width: 75%;
    margin: 0 auto;

    .top-form-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 50%;
        margin: 0 auto;

        .search-bar {
            display: flex;
            flex-direction: row;
            
            input {
                flex-grow: 1;
            }
        }

        .collapse-btn {
            align-self: flex-end;
        }
    }

    .form-section {
        display: flex;
        flex-direction: column;
        
        .section-title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 8px;

            h4 {
                margin: 0;
            }

            h5 {
                margin: 0;
                font-size: 0.9em;
            }
        }

        .section-body {
            padding: 8px;
            display: flex;
            flex-direction: column;

            .checkboxes {
                overflow-y: auto;
                overflow-x: hidden;
                max-height: 180px;
            }

            &.containers {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;

                .section-title {
                    justify-content: unset;

                    .container-collapse-btn {
                        margin-left: auto;
                        padding: 2px 3px;
                    }
                }

                .section-body {
                    // overflow: hidden;

                    &.collapse {
                        height: 0;
                    }
                }
            }
        }
    }

    .span-x-2 {
        grid-column: span 2;
    }

    .span-y-2 {
        grid-row: span 2;
    }

    .form-bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .limit-input {
            display: flex;
            flex-direction: row;
            gap: 6px;
            align-items: center;

            input {
                width: 66px;
            }
        }
    }
}

.info-tooltip {
    font-size: 0.9em;
}

.align-self-start {
    align-self: flex-start;
}

.ml-auto {
    margin-left: auto;
}

.custom-property {
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
    margin-bottom: 8px;

    .delete-btn {
        $red: #eb2b2b;
        
        color: $red;
        border: 1px solid $red;

        &:hover {
            background-color: $red;
            color: white
        }
    }
}

.results-grid {
    display: flex;
    flex-direction: row;
    gap: 12px;

    .results, .map-container {
        flex: 1;
    }

    .results {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .map-container {
        h4 {
            margin-top: 0;
            margin-bottom: 12px;
        }
    }
}
</style>