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
];

const properties = ref([]);
const catalog = ref({});

onMounted(() => {
    doRequest(`${apiBaseUrl}/c`, () => {
        parseIntoStore(data.value);

        // const subject = store.value.getSubjects(namedNode(qname("a")), namedNode("http://www.w3.org/ns/dcat#Catalog"))[0];
        // catalog.value.iri = subject.id;
        // store.value.forEach(q => { // get preds & objs
        //     if (q.predicate.value === "http://purl.org/dc/terms/description") {
        //         catalog.value.description = q.object.value;
        //     }
        //     properties.value.push(q);
        // }, subject, null, null);

        ui.rightNavConfig = { enabled: true, profiles: profiles, currentUrl: route.path };
        document.title = "CatPrez | Prez";
        ui.pageHeading = { name: "CatPrez", url: "/c"};
        ui.breadcrumbs = [{ name: "CatPrez", url: "/c" }];
    });
});
</script>

<template>
    <h1>CatPrez Home</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis in libero qui earum rem facilis optio culpa nobis magnam commodi. Sunt aspernatur obcaecati eos expedita aperiam magnam ipsum incidunt impedit?</p>
    <p v-if="!!catalog.description">{{ catalog.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds" />
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>