<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig, type ListItem } from "@/types";
import ItemList from "@/components/ItemList.vue";

const { namedNode } = DataFactory;

const { apiBaseUrl } = inject(configKey, defaultConfig);
const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qname } = useRdfStore();

const catalogs = ref<ListItem[]>([]);

const { data, profiles, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/c/catalogs`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0];

        store.value.forObjects(member => {
            let c: ListItem = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname("dcterms:title")) {
                    c.title = q.object.value;
                } else if (q.predicate.value === qname("dcterms:description")) {
                    c.description = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    c.link = q.object.value;
                }
            }, member, null, null, null);
            catalogs.value.push(c);
        }, subject, namedNode(qname("rdfs:member")), null);
    });

    ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
    document.title = "Catalogs | Prez";
    ui.pageHeading = { name: "CatPrez", url: "/c"};
    ui.breadcrumbs = [{ name: "CatPrez", url: "/c" }, { name: "Catalogs", url: route.path }];
});
</script>

<template>
    <h1>Catalogs</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis in libero qui earum rem facilis optio culpa nobis magnam commodi. Sunt aspernatur obcaecati eos expedita aperiam magnam ipsum incidunt impedit?</p>
    <div>
        <ItemList v-if="data" :items="catalogs" />
        <template v-else-if="loading">loading...</template>
        <template v-else-if="error">Network error: {{ error }}</template>
    </div>
</template>

<style lang="scss" scoped>

</style>