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
    // "http://www.w3.org/2004/02/skos/core#member"
];

const properties = ref([]);
const collection = ref({});

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/collection/${route.params.collectionId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode("http://www.w3.org/2004/02/skos/core#Collection"))[0];
        collection.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === "http://www.w3.org/2004/02/skos/core#prefLabel") {
                collection.value.title = q.object.value;
            } else if (q.predicate.value === "http://www.w3.org/2004/02/skos/core#definition") {
                collection.value.description = q.object.value;
            }
            properties.value.push(q);
        }, subject, null, null);
        
        // let conceptArray = [];

        // store.value.forSubjects(subject => { // for each concept
        //     let c = {
        //         iri: subject.id,
        //         narrower: [],
        //         broader: null
        //     };
        //     store.value.forEach(q => { // get preds & objs for each subj
        //         if (q.predicate.value === qname("rdfs:label")) {
        //             c.title = q.object.value;
        //         } else if (q.predicate.value === qname("dcterms:identifier")) {
        //             c.id = q.object.value;
        //         }
        //     }, subject, null, null);
        //     conceptArray.push(c);
        // }, namedNode("http://www.w3.org/2004/02/skos/core#inScheme"), namedNode(vocab.value.iri));

        ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
        document.title = `${collection.value.title} | Prez`;
        ui.pageHeading = { name: "VocPrez", url: "/v"};
        ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "Collections", url: "/v/collection" }, { name: collection.value.title, url: route.path }];
    });
});
</script>

<template>
    <h1>{{ collection.title }}</h1>
    <p>Instance IRI: <a :href="collection.iri" target="_blank" rel="noopener noreferrer">{{ collection.iri }} <i class="fa-regular fa-arrow-up-right-from-square"></i></a></p>
    <p v-if="!!collection.description">{{ collection.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds">
        <template #bottom>
            <tr>
                <th>Concepts</th>
                <td>
                    <!-- <RouterLink :to="`${route.path}/collections`" class="btn">Collections</RouterLink> -->
                </td>
            </tr>
        </template>
    </PropTable>
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>