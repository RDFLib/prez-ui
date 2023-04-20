<script lang="ts" setup>
import { onMounted, ref, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";
import { apiBaseUrlConfigKey } from "@/types";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

interface SearchResult {
    label?: string;
    uri: string;
    source: string;
};

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();
const { data, loading, error, doRequest } = useGetRequest();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();

const query = ref(route.query as {[key: string]: string});
const results = ref<SearchResult[]>([]);

function getResults() {
    if (route.query && route.query.term) {
        results.value = [];
        doRequest(`${apiBaseUrl}${route.fullPath}`, () => {
            parseIntoStore(data.value);
            store.value.forSubjects(subject => {
                let resultUri = subject.value;
                let resultLabel = undefined;
                let resultSource = "";

                store.value.forEach(q => {
                    if ([qname("skos:prefLabel"), qname("dcterms:title"), qname("rdfs:label")].includes(q.predicate.value)) {
                        resultLabel = q.object.value;
                    }
                    if (q.predicate.value === qname("prez:searchResultSource") ) {
                        resultSource = q.object.value.replace(qname("prez:"), "");
                    }
                }, subject, null, null, null);
                results.value.push({
                    uri: resultUri,
                    label: resultLabel,
                    source: resultSource
                });
            }, null, null, null);
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
    <template v-if="error">
        <ErrorMessage :message="error" />
    </template>
    <template v-else-if="loading">
        <i class="fa-regular fa-spinner-third fa-spin"></i> Loading...
    </template>
    <template v-else-if="route.query && route.query.term">
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
    </template>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

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
</style>