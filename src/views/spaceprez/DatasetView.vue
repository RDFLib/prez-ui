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
    "http://purl.org/dc/terms/title",
    "http://www.w3.org/2000/01/rdf-schema#member"
];

const properties = ref([]);
const dataset = ref({});

onMounted(() => {
    doRequest(`${apiBaseUrl}/s/datasets/${route.params.datasetId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
        dataset.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === qname("dcterms:title")) {
                dataset.value.title = q.object.value;
            } else if (q.predicate.value === qname("dcterms:description")) {
                dataset.value.description = q.object.value;
            }
            q.predicate.annotations = store.value.getQuads(q.predicate, null, null);
            properties.value.push(q);
        }, subject, null, null);
        
        ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
        document.title = `${dataset.value.title} | Prez`;
        ui.pageHeading = { name: "SpacePrez", url: "/s"};
        ui.breadcrumbs = [{ name: "SpacePrez", url: "/s" }, { name: "Datasets", url: "/s/datasets" }, { name: dataset.value.title, url: route.path }];
    });
});
</script>

<template>
    <h1>{{ dataset.title }}</h1>
    <p>Instance IRI: <a :href="dataset.iri" target="_blank" rel="noopener noreferrer">{{ dataset.iri }} <i class="fa-regular fa-arrow-up-right-from-square"></i></a></p>
    <p v-if="!!dataset.description">{{ dataset.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds">
        <template #bottom>
            <tr>
                <th>Members</th>
                <td>
                    <RouterLink :to="`${route.path}/collections`" class="btn">Collections</RouterLink>
                </td>
            </tr>
        </template>
    </PropTable>
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>