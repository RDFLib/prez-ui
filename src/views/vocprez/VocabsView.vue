<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import ItemList from "@/components/ItemList.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject("config").apiBaseUrl;
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();

const { data, profiles, loading, error, doRequest } = useGetRequest();

const vocabs = ref([]);

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/vocab`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")))[0];

        store.value.forObjects(member => {
            let v = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname("skos:prefLabel")) {
                    v.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    v.link = q.object.value;
                } else if (q.predicate.value === qname("dcterms:description")) {
                    v.description = q.object.value;
                }
            }, member, null, null);
            vocabs.value.push(v);
        }, subject, namedNode(qname("rdfs:member")));
    });

    ui.rightNavConfig = { enabled: true, profiles: profiles, currentUrl: route.path };
    document.title = "Vocabs | Prez";
    ui.pageHeading = { name: "VocPrez", url: "/v"};
    ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "Vocabs", url: route.path }];
});
</script>

<template>
    <h1>Vocabs</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis in libero qui earum rem facilis optio culpa nobis magnam commodi. Sunt aspernatur obcaecati eos expedita aperiam magnam ipsum incidunt impedit?</p>
    <ItemList v-if="data" :items="vocabs" />
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>