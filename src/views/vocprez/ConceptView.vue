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
    "http://www.w3.org/2004/02/skos/core#definition",
    "http://www.w3.org/2004/02/skos/core#prefLabel",
];

const properties = ref([]);
const concept = ref({});

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/vocab/${route.params.vocabId}/${route.params.conceptId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode("http://www.w3.org/2004/02/skos/core#Concept"))[0];
        concept.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === "http://www.w3.org/2004/02/skos/core#prefLabel") {
                concept.value.title = q.object.value;
            } else if (q.predicate.value === "http://www.w3.org/2004/02/skos/core#definition") {
                concept.value.description = q.object.value;
            }
            properties.value.push(q);
        }, subject, null, null);

        ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
        document.title = `${concept.value.title} | Prez`;
        ui.pageHeading = { name: "VocPrez", url: "/v"};
        ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "Vocabs", url: "/v/vocab" }, { name: "Vocab", url: `/v/vocab/${route.params.vocabId}` }, { name: concept.value.title, url: route.path }];
    });
});
</script>

<template>
    <h1>{{ concept.title }}</h1>
    <p>Instance IRI: <a :href="concept.iri" target="_blank" rel="noopener noreferrer">{{ concept.iri }} <i class="fa-regular fa-arrow-up-right-from-square"></i></a></p>
    <p v-if="!!concept.description">{{ concept.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds" />
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>