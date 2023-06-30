<script lang="ts" setup>
import { onMounted, ref, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";
import { apiBaseUrlConfigKey } from "@/types";
import type { WKTResult } from "@/stores/mapSearchStore.d";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import MapClient from "@/components/MapClient.vue";

const { namedNode } = DataFactory;

const LABEL_PREDICATES = [
    "skos:prefLabel",
    "dcterms:title",
    "rdfs:label",
    "sdo:name"
];

interface SearchResult {
    label?: string;
    uri: string;
    source: string;
};

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();
const { data, loading, error, doRequest } = useGetRequest();
const { store, parseIntoStore, qname } = useRdfStore();

const query = ref(route.query as {[key: string]: string});
const results = ref<SearchResult[]>([]);
const searchMapRef = ref()
const geoResults = ref<WKTResult[]>([]);

function getResults() {
    if (route.query && route.query.term) {
        results.value = [];
        geoResults.value = [];

        doRequest(`${apiBaseUrl}${route.fullPath}`, () => {
            parseIntoStore(data.value);
            const labelPredicateIris = LABEL_PREDICATES.map(p => qname(p));

            store.value.forSubjects(subject => {
                let resultUri = subject.value;
                let resultLabel = undefined;
                let resultSource = "";
                let resultCoordinates = undefined;

                store.value.forEach(q => {
                    if (labelPredicateIris.includes(q.predicate.value)) {
                        resultLabel = q.object.value;
                    } else if (q.predicate.value === qname("prez:searchResultSource") ) {
                        resultSource = q.object.value.replace(qname("prez:"), "");
                    } else if (q.predicate.value === qname("geo:hasGeometry")) {
                        store.value.forEach(geometryTriple => {
                            resultCoordinates = geometryTriple.object.value;
                        }, q.object, namedNode(qname("geo:asWKT")),  null, null);
                    }                    
                }, subject, null, null, null);
                
                results.value.push({
                    uri: resultUri,
                    label: resultLabel,
                    source: resultSource
                });

                if (resultCoordinates) {
                    geoResults.value.push({
                        uri: resultUri,
                        link: `/object?uri=${resultUri}`,
                        label: resultLabel ? resultLabel : resultUri,
                        fcLabel: "",
                        wkt: resultCoordinates
                    });
                }
            }, namedNode(qname("a")), namedNode(qname("prez:SearchResult")), null);
        });
    }
}

watch(() => route.query, (newValue, oldValue) => {
    if (Object.keys(newValue).length > 0 && newValue !== oldValue) {
        getResults();
    }
}, { deep: true });

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Advanced Search | Prez";
    ui.pageHeading = { name: "Prez", url: "/" };
    ui.breadcrumbs = [{ name: "Advanced Search", url: "/search" }];
    if (Object.keys(route.query).length > 0) {
        getResults();
    }
});
</script>

<template>
    <h1 class="page-title">Advanced Search</h1>
    <AdvancedSearch :query="query" fullPage/>
    <ErrorMessage v-if="error" :message="error" />
    <template v-else-if="loading">
        <h3>Loading...</h3>
        <LoadingMessage />
    </template>
    <template v-else-if="route.query && route.query.term">
        <div class="container">
            <div class="left-panel">
                <h2>Results</h2>
                <div class="results-cols">
                    <span>Title</span>
                    <span>Source</span>
                </div>
                <div v-if="results.length > 0" class="results">
                    <RouterLink v-for="result in results" class="result" :to="`/object?uri=${encodeURIComponent(result.uri)}`">
                        <span>{{ result.label || result.uri }}</span>
                        <span :style="{ color: 'black' }">{{ result.source }}</span>
                    </RouterLink>
                </div>
                <p v-else>No results found.</p>
            </div>
            <div v-if="geoResults.length" class="right-panel">
                <div class="results-title">Spatial Results</div>
                <MapClient v-if="geoResults.length"
                    ref="searchMapRef" 
                    :geo-w-k-t="geoResults"
                />
            </div>
        </div>
    </template>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";


.container {
    display: grid;
    grid-template-columns: 2fr 2fr;
}

.right-panel {
    min-width: 320px;
    padding-top: 4.17em;
    padding-left: 1em;
}

.results-title {
    font-weight:bold;
    margin-bottom:6px;
}

/* Media query for small screens */
@media (max-width: 1024px) {
    .container {
        grid-template-columns: 1fr;
    }
    .left-panel {
        margin-bottom: 2em;
    }
    .right-panel {
        width: 100%;
        margin:0;
        padding:0;
    }
}


%resultsColumns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.results-cols {
    @extend %resultsColumns;
    font-weight: bold;
    margin-bottom: 6px;
}

.results {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .result {
        background-color: var(--cardBg);
        padding: 6px;
        border-radius: $borderRadius;
        @extend %resultsColumns;
    }
}

.loading-icon {
  position: relative;
  width: 20px;
  height: 20px; 
  margin:0;
  padding:0;
  -webkit-animation: fa-spin 2s infinite linear;
  animation: fa-spin 2s infinite linear;
}

.loading-icon:before {
  content: "\f1ce";
  font-family: FontAwesome;
  font-size:20px;
  line-height:21px;
  position: absolute;
  top: 0; 
  bottom:0;
}
</style>