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

const datasets = ref<ListItem[]>([]);

const { data, profiles, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/s/datasets`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0];

        store.value.forObjects(member => {
            let d: ListItem = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname("dcterms:title")) {
                    d.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    d.link = q.object.value;
                } else if (q.predicate.value === qname("dcterms:description")) {
                    d.description = q.object.value;
                }
            }, member, null, null, null);
            datasets.value.push(d);
        }, subject, namedNode(qname("rdfs:member")), null);
    });
    ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
    document.title = "Datasets | Prez";
    ui.pageHeading = { name: "SpacePrez", url: "/s"};
    ui.breadcrumbs = [{ name: "SpacePrez", url: "/s" }, { name: "Datasets", url: route.path }];
});
</script>

<template>
    <h1>Datasets</h1>
    <p>The listing of <a :href="qname('dcat:Dataset')" target="_blank" rel="noopener noreferrer">dcat:Datasets</a>.</p>
    <div>
        <ItemList v-if="data" :items="datasets" childName="Feature Collections" childLink="/collections" />
        <template v-else-if="loading">loading...</template>
        <template v-else-if="error">Network error: {{ error }}</template>
    </div>
</template>

<style lang="scss" scoped>

</style>