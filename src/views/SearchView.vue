<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { DataFactory, type Literal } from "n3";
import type { languageLabel } from "@/types";
import { useUiStore } from "@/stores/ui";
import { useApiRequest } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";
import router from "@/router";
import { sortByTitle, getLanguagePriority, allOptionsSelected, ensureProfiles } from "@/util/helpers";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import NewTooltip from "@/components/NewTooltip.vue";

const { namedNode } = DataFactory;

type option = {
    title?: string;
    iri: string;
};

type searchResult = {
    label?: string;
    uri: string;
    source: string;
};

const route = useRoute();
const ui = useUiStore();
const { loading, error, apiGetRequest } = useApiRequest(); // search request
const { store, parseIntoStore, qnameToIri } = useRdfStore(); // search results store
const { loading: catalogLoading, error: catalogError, apiGetRequest: catalogApiGetRequest } = useApiRequest(); // catalog request
const { loading: datasetLoading, error: datasetError, apiGetRequest: datasetApiGetRequest } = useApiRequest(); // dataset request
const { loading: vocabLoading, error: vocabError, apiGetRequest: vocabApiGetRequest } = useApiRequest(); // vocab request
const { loading: collectionLoading, error: collectionError, apiGetRequest: collectionApiGetRequest } = useApiRequest(); // collection request
const { store: optionsStore, parseIntoStore: optionParseIntoStore, qnameToIri: optionQnameToIri } = useRdfStore(); // options store

const DEFAULT_LABEL_PREDICATES = [qnameToIri("rdfs:label")];
const DEFAULT_DESC_PREDICATES = [qnameToIri("dcterms:description")];
const SEARCH_METHOD = "default";

// const SEARCH_METHODS: option[] = [
//     {
//         iri: "default",
//         title: "Default"
//     },
//     {
//         iri: "exactMatch",
//         title: "Exact Match"
//     },
//     {
//         iri: "jenaFTName",
//         title: "Jena F T Name"
//     },
//     {
//         iri: "skosPrefLabel",
//         title: "Skos Pref Label"
//     },
//     {
//         iri: "skosWeighted",
//         title: "Skos Weighted"
//     },
// ];

const BASE_CLASSES: (option & { tooltip: string })[] = [
    {
        iri: optionQnameToIri("dcat:Catalog"),
        title: "Catalog",
        tooltip: "A catalog is ..."
    },
    {
        iri: optionQnameToIri("skos:Collection"),
        title: "Collection",
        tooltip: "A collection is ..."
    },
    {
        iri: optionQnameToIri("skos:Concept"),
        title: "Concept",
        tooltip: "A concept is ..."
    },
    {
        iri: optionQnameToIri("skos:ConceptScheme"),
        title: "Concept Scheme",
        tooltip: "A concept scheme is ..."
    },
    {
        iri: optionQnameToIri("dcat:Dataset"),
        title: "Dataset",
        tooltip: "A dataset is ..."
    },
    {
        iri: optionQnameToIri("geo:Feature"),
        title: "Feature",
        tooltip: "A feature is ..."
    },
    {
        iri: optionQnameToIri("geo:FeatureCollection"),
        title: "Feature Collection",
        tooltip: "A feature collection is ..."
    },
    {
        iri: optionQnameToIri("dcat:Resource"),
        title: "Resource",
        tooltip: "A resource is ..."
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
        dataset: option[];
        catalog: option[];
        vocab: option[];
        collection: option[];
    };
    baseClasses: (option & { tooltip: string })[];
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
const containerCollapse = ref({
    dataset: false,
    catalog: false,
    vocab: false,
    collection: false,
});
const datasetCollapse = ref<{ [key: string]: boolean }>({});
const results = ref<searchResult[]>([]);

const allBaseClassesSelected = computed(() => {
    return allOptionsSelected(options.value.baseClasses, data.value.baseClasses);
});

const allContainersSelected = computed(() => {
    return {
        catalog: allOptionsSelected(options.value.containers.catalog, data.value.containers.catalog),
        dataset: allOptionsSelected(options.value.containers.dataset, data.value.containers.dataset),
        vocab: allOptionsSelected(options.value.containers.vocab, data.value.containers.vocab),
        collection: allOptionsSelected(options.value.containers.collection, data.value.containers.collection),
    }
});

function toggleSelectAllBaseClasses() {
    data.value.baseClasses = !allBaseClassesSelected.value ? options.value.baseClasses.map(o => o.iri) : [];
}

function toggleSelectAllContainers(containerType: "catalog" | "dataset" | "vocab" | "collection") {
    data.value.containers[containerType] = !allContainersSelected.value[containerType] ? options.value.containers[containerType].map(o => o.iri) : [];
}

function getCatalogs() {
    catalogApiGetRequest("/c/catalogs").then(r => {
        const { data: catalogData, profiles } = r;
        if (data && profiles.length > 0) {
            const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
            const labelPredicates = defaultProfile!.labelPredicates.length > 0 ? defaultProfile!.labelPredicates : DEFAULT_LABEL_PREDICATES;

            optionParseIntoStore(catalogData);
            const catalogOptions: option[] = [];

            optionsStore.value.forSubjects(subject => {
                if (!subject.value.endsWith("/system/catprez")) { // hide system catalog
                    const catalog: option = {
                        iri: subject.value
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
                        }
                    }, subject, null, null, null);

                    labels.sort((a, b) => a.priority - b.priority);
                    catalog.title = labels.length > 0 ? labels[0].value : undefined;

                    catalogOptions.push(catalog);
                }
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Catalog")), null);

            catalogOptions.sort(sortByTitle);
            options.value.containers.catalog = catalogOptions;
            data.value.containers.catalog = catalogOptions.map(c => c.iri);
        }
    });
}

function getDatasets() {
    datasetApiGetRequest("/s/datasets").then(r => {
        const { data: datasetData, profiles } = r;
        if (data && profiles.length > 0) {
            const defaultProfile = ui.profiles[profiles.find(p => p.default)!.uri];
            const labelPredicates = defaultProfile!.labelPredicates.length > 0 ? defaultProfile!.labelPredicates : DEFAULT_LABEL_PREDICATES;

            optionParseIntoStore(datasetData);
            const datasetOptions: option[] = [];

            optionsStore.value.forSubjects(subject => {
                const dataset: option = {
                    iri: subject.value
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
                        }
                    }, subject, null, null, null);

                    labels.sort((a, b) => a.priority - b.priority);
                    dataset.title = labels.length > 0 ? labels[0].value : undefined;

                datasetOptions.push(dataset);
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Dataset")), null);

            datasetOptions.sort(sortByTitle);
            options.value.containers.dataset = datasetOptions;
            data.value.containers.dataset = datasetOptions.map(c => c.iri);
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
            const vocabOptions: option[] = [];

            optionsStore.value.forSubjects(subject => {
                const vocab: option = {
                    iri: subject.value
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
                    }
                }, subject, null, null, null);

                labels.sort((a, b) => a.priority - b.priority);
                vocab.title = labels.length > 0 ? labels[0].value : undefined;

                vocabOptions.push(vocab);
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("skos:ConceptScheme")), null);

            vocabOptions.sort(sortByTitle);
            options.value.containers.vocab = vocabOptions;
            data.value.containers.vocab = vocabOptions.map(c => c.iri);
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
            const collectionOptions: option[] = [];

            optionsStore.value.forSubjects(subject => {
                const collection: option = {
                    iri: subject.value
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
                    }
                }, subject, null, null, null);

                labels.sort((a, b) => a.priority - b.priority);
                collection.title = labels.length > 0 ? labels[0].value : undefined;

                collectionOptions.push(collection);
            }, namedNode(qnameToIri("a")), namedNode(qnameToIri("skos:Collection")), null);

            collectionOptions.sort(sortByTitle);
            options.value.containers.collection = collectionOptions;
            data.value.containers.collection = collectionOptions.map(c => c.iri);
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
    if (!allBaseClassesSelected.value && data.value.baseClasses.length > 0) {
        queryList.push(`focus-to-filter[rdf:type]=${data.value.baseClasses.map(c => encodeURIComponent(c)).join(",")}`);
    }

    // if not all containers are selected
    if (!(allContainersSelected.value.catalog && allContainersSelected.value.dataset && allContainersSelected.value.vocab && allContainersSelected.value.collection)) {
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

async function submit() {
    const query = formToQueryString();
    console.log(query)
    // router.push(`/search${query}`)
    const { data } = await apiGetRequest(`/search${query}`);
    console.log(data)
}

async function getResults() {
    // API call
    console.log("sending query to API...")
    console.log(route.fullPath)
    const { data } = await apiGetRequest(route.fullPath);
    console.log(data)
}

// watch(() => route.query, async (newValue, oldValue) => {
//     if (Object.keys(newValue).length > 0 && newValue !== oldValue) {
//         queryStringToForm();
//         await getResults();
//     }
// }, { deep: true });

onMounted(async () => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Advanced Search | Prez";
    ui.pageHeading = { name: "Prez", url: "/" };
    ui.breadcrumbs = [{ name: "Advanced Search", url: "/search" }];

    data.value.baseClasses = options.value.baseClasses.map(c => c.iri);

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
        <div v-if="!collapse" class="form-section span-x-2">
            <div class="section-title">
                <h4>Base Classes</h4>
                <NewTooltip class="info-tooltip">
                    <i class="fa-regular fa-circle-question"></i>
                    <template #text>
                        Object types
                    </template>
                </NewTooltip>
            </div>
            <div class="section-body">
                <div class="checkboxes">
                    <div class="checkbox check-all">
                        <input type="checkbox" name="" id="class-all" :checked="allBaseClassesSelected" @change="toggleSelectAllBaseClasses">
                        <label for="class-all">Check All</label>
                    </div>
                    <div v-for="(option, index) in options.baseClasses" class="checkbox">
                        <input type="checkbox" name="" :id="`class-${index}`" :value="option.iri" v-model="data.baseClasses">
                        <label :for="`class-${index}`">{{ option.title || option.iri }}</label>
                        <NewTooltip class="info-tooltip ml-auto">
                            <i class="fa-regular fa-circle-question"></i>
                            <template #text>
                                {{ option.tooltip }}
                            </template>
                        </NewTooltip>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!collapse" class="form-section span-x-2 span-y-2">
            <div class="section-title">
                <h4>Containers</h4>
                <NewTooltip class="info-tooltip">
                    <i class="fa-regular fa-circle-question"></i>
                    <template #text>
                        Filter by items contained by these objects.
                    </template>
                </NewTooltip>
            </div>
            <div class="section-body containers">
                <div class="form-section">
                    <div class="section-title">
                        <input type="checkbox" name="" id="catalog-all" :checked="allContainersSelected.catalog" @change="toggleSelectAllContainers('catalog')">
                        <label for="catalog-all">
                            <h5>Catalogs</h5>
                        </label>
                        <button
                            class="btn outline sm container-collapse-btn"
                            @click="containerCollapse.catalog = !containerCollapse.catalog"
                            title="Toggle collapse catalogs"
                        >
                            <i :class="`fa-solid fa-chevron-${containerCollapse.catalog ? 'down' : 'up'}`"></i>
                        </button>
                        <NewTooltip class="info-tooltip">
                            <i class="fa-regular fa-circle-question"></i>
                            <template #text>
                                Catalogues
                            </template>
                        </NewTooltip>
                    </div>
                    <div :class="`section-body ${containerCollapse.catalog ? 'collapse' : ''}`">
                        <ErrorMessage v-if="catalogError" :message="catalogError" />
                        <LoadingMessage v-else-if="catalogLoading" />
                        <div v-else class="checkboxes">
                            <div v-for="(catalog, index) in options.containers.catalog" class="checkbox">
                                <input type="checkbox" name="" :id="`catalog-${index}`" :value="catalog.iri" v-model="data.containers.catalog">
                                <label :for="`catalog-${index}`">{{ catalog.title || catalog.iri }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-title">
                        <input type="checkbox" name="" id="dataset-all" :checked="allContainersSelected.dataset" @change="toggleSelectAllContainers('dataset')">
                        <label for="dataset-all">
                            <h5>Datasets</h5>
                        </label>
                        <button
                            class="btn outline sm container-collapse-btn"
                            @click="containerCollapse.dataset = !containerCollapse.dataset"
                            title="Toggle collapse datasets"
                        >
                            <i :class="`fa-solid fa-chevron-${containerCollapse.dataset ? 'down' : 'up'}`"></i>
                        </button>
                        <NewTooltip class="info-tooltip">
                            <i class="fa-regular fa-circle-question"></i>
                            <template #text>
                                Datasets
                            </template>
                        </NewTooltip>
                    </div>
                    <div :class="`section-body ${containerCollapse.dataset ? 'collapse' : ''}`">
                        <ErrorMessage v-if="datasetError" :message="datasetError" />
                        <LoadingMessage v-else-if="datasetLoading" />
                        <div v-else class="checkboxes">
                            <div v-for="(dataset, index) in options.containers.dataset" class="checkbox">
                                <input type="checkbox" name="" :id="`dataset-${index}`" :value="dataset.iri" v-model="data.containers.dataset">
                                <label :for="`dataset-${index}`">{{ dataset.title || dataset.iri }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-title">
                        <input type="checkbox" name="" id="vocab-all" :checked="allContainersSelected.vocab" @change="toggleSelectAllContainers('vocab')">
                        <label for="vocab-all">
                            <h5>Vocabularies</h5>
                        </label>
                        <button
                            class="btn outline sm container-collapse-btn"
                            @click="containerCollapse.vocab = !containerCollapse.vocab"
                            title="Toggle collapse vocabularies"
                        >
                            <i :class="`fa-solid fa-chevron-${containerCollapse.vocab ? 'down' : 'up'}`"></i>
                        </button>
                        <NewTooltip class="info-tooltip">
                            <i class="fa-regular fa-circle-question"></i>
                            <template #text>
                                Vocabularies
                            </template>
                        </NewTooltip>
                    </div>
                    <div :class="`section-body ${containerCollapse.vocab ? 'collapse' : ''}`">
                        <ErrorMessage v-if="vocabError" :message="vocabError" />
                        <LoadingMessage v-else-if="vocabLoading" />
                        <div v-else class="checkboxes">
                            <div v-for="(vocab, index) in options.containers.vocab" class="checkbox">
                                <input type="checkbox" name="" :id="`vocab-${index}`" :value="vocab.iri" v-model="data.containers.vocab">
                                <label :for="`vocab-${index}`">{{ vocab.title || vocab.iri }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-title">
                        <input type="checkbox" name="" id="collection-all" :checked="allContainersSelected.collection" @change="toggleSelectAllContainers('collection')">
                        <label for="collection-all">
                            <h5>Collections</h5>
                        </label>
                        <button
                            class="btn outline sm container-collapse-btn"
                            @click="containerCollapse.collection = !containerCollapse.collection"
                            title="Toggle collapse collections"
                        >
                            <i :class="`fa-solid fa-chevron-${containerCollapse.collection ? 'down' : 'up'}`"></i>
                        </button>
                        <NewTooltip class="info-tooltip">
                            <i class="fa-regular fa-circle-question"></i>
                            <template #text>
                                Collections
                            </template>
                        </NewTooltip>
                    </div>
                    <div :class="`section-body ${containerCollapse.collection ? 'collapse' : ''}`">
                        <ErrorMessage v-if="collectionError" :message="collectionError" />
                        <LoadingMessage v-else-if="collectionLoading" />
                        <div v-else class="checkboxes">
                            <div v-for="(collection, index) in options.containers.collection" class="checkbox">
                                <input type="checkbox" name="" :id="`collection-${index}`" :value="collection.iri" v-model="data.containers.collection">
                                <label :for="`collection-${index}`">{{ collection.title || collection.iri }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!collapse" class="form-section">
            <div class="section-title">
                <h4>Outbound Properties</h4>
                <NewTooltip class="info-tooltip">
                    <i class="fa-regular fa-circle-question"></i>
                    <template #text>
                        Properties of the item you're searching for.
                    </template>
                </NewTooltip>
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
                <NewTooltip class="info-tooltip">
                    <i class="fa-regular fa-circle-question"></i>
                    <template #text>
                        Relational properties that point to this item.
                    </template>
                </NewTooltip>
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
    <h2>Results</h2>
    <LoadingMessage v-if="loading"/>
    <!-- <ErrorMessage v-if="error" :message="error" />
    <LoadingMessage v-else-if="loading"/>
    <div v-else-if="results.length > 0" class="results">
        <div v-for="result in results">
            <pre>{{ result }}</pre>
        </div>
    </div>
    <p v-else-if="!loading && results.length === 0 && Object.keys(route.query).length > 0">No results found.</p> -->
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
                    overflow: hidden;

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

.checkboxes {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .checkbox {
        display: flex;
        flex-direction: row;
        gap: 6px;
        align-items: center;

        &.check-all {
            margin-bottom: 6px;
        }
    }
}
</style>