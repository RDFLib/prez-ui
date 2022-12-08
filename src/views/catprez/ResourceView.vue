<script setup>
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
const resource = ref({});

onMounted(() => {
    doRequest(`${apiBaseUrl}/c/catalogs/${route.params.catalogId}/${route.params.resourceId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Resource")))[0];
        resource.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === qname("dcterms:title")) {
                resource.value.title = q.object.value;
            } else if (q.predicate.value === qname("dcterms:description")) {
                resource.value.description = q.object.value;
            }
            q.predicate.annotations = store.value.getQuads(q.predicate, null, null);
            properties.value.push(q);
        }, subject, null, null);

        ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
        document.title = `${resource.value.title} | Prez`;
        ui.pageHeading = { name: "CatPrez", url: "/c"};
        ui.breadcrumbs = [
            { name: "CatPrez", url: "/c" },
            { name: "Catalogs", url: "/c/catalogs" },
            { name: "Catalog", url: `/c/catalogs/${route.params.catalogId}` },
            { name: resource.value.title, url: route.path }
        ];
    });
});
</script>

<template>
    <h1>{{ resource.title }}</h1>
    <p>Instance IRI: <a :href="resource.iri" target="_blank" rel="noopener noreferrer">{{ resource.iri }}</a></p>
    <p v-if="!!resource.description">{{ resource.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds" />
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>