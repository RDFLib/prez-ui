<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import PropTable from "@/components/PropTable.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject("config").apiBaseUrl;
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const hiddenPreds = [
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "http://purl.org/dc/terms/identifier",
    "http://purl.org/dc/terms/description",
    "http://purl.org/dc/terms/title"
];

const properties = ref([]);
const feature = ref({});

onMounted(() => {
    doRequest(`${apiBaseUrl}/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}/items/${route.params.featureId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("geo:Feature")))[0];
        feature.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === qname("dcterms:title")) {
                feature.value.title = q.object.value;
            } else if (q.predicate.value === qname("dcterms:description")) {
                feature.value.description = q.object.value;
            }
            q.predicate.annotations = store.value.getQuads(q.predicate, null, null);
            properties.value.push(q);
        }, subject, null, null);
    
        ui.rightNavConfig = { enabled: true, profiles: profiles, currentUrl: route.path };
        document.title = `${feature.value.title} | Prez`;
        ui.pageHeading = { name: "SpacePrez", url: "/s"};
        ui.breadcrumbs = [
            { name: "SpacePrez", url: "/s" },
            { name: "Datasets", url: "/s/datasets" },
            { name: "Dataset", url: `/s/datasets/${route.params.datasetId}` },
            { name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` },
            { name: "Feature Collection", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}` },
            { name: "Features", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}/items` },
            { name: feature.value.title, url: route.path }
        ];
    });

    ui.rightNavConfig = { enabled: true, profiles: profiles, currentUrl: route.path };
});
</script>

<template>
    <h1>{{ feature.title }}</h1>
    <p>Instance IRI: <a :href="feature.iri" target="_blank" rel="noopener noreferrer">{{ feature.iri }} <i class="fa-regular fa-arrow-up-right-from-square"></i></a></p>
    <p v-if="!!feature.description">{{ feature.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds" />
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>