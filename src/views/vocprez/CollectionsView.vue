<script setup>
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

const collections = ref([]);

const { data, profiles, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/collection`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")))[0];

        store.value.forObjects(member => {
            let c = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname("rdfs:label")) {
                    c.title = q.object.value;
                } else if (q.predicate.value === "http://purl.org/dc/terms/identifier") {
                    c.id = q.object.value;
                    c.link = `/v/collection/${q.object.value}`;
                }
            }, member, null, null);
            collections.value.push(c);
        }, subject, namedNode(qname("rdfs:member")));
    });
    ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
    document.title = "Collections | Prez";
    ui.pageHeading = { name: "VocPrez", url: "/v"};
    ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "Collections", url: route.path }];
});
</script>

<template>
    <h1>Collections</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis in libero qui earum rem facilis optio culpa nobis magnam commodi. Sunt aspernatur obcaecati eos expedita aperiam magnam ipsum incidunt impedit?</p>
    <div>
        <ItemList v-if="data" :items="collections" />
        <template v-else-if="loading">loading...</template>
        <template v-else-if="error">Network error: {{ error }}</template>
    </div>
</template>

<style lang="scss" scoped>

</style>