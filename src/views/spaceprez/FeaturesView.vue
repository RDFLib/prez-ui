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

const features = ref<ListItem[]>([]);

const { data, profiles, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}/items`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0];

        store.value.forObjects(member => {
            let c: ListItem = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname("rdfs:label")) {
                    c.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    c.link = q.object.value;
                }
            }, member, null, null, null);
            features.value.push(c);
        }, subject, namedNode(qname("rdfs:member")), null);

        ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        document.title = `Features of Feature Collection | Prez`;
        ui.pageHeading = { name: "SpacePrez", url: "/s"};
        ui.breadcrumbs = [
            { name: "SpacePrez", url: "/s" },
            { name: "Datasets", url: "/s/datasets" },
            { name: "Dataset", url: `/s/datasets/${route.params.datasetId}` },
            { name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` },
            { name: "Feature Collection", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}` },
            { name: "Features", url: route.path }
        ];
    });
});
</script>

<template>
    <h1>Features</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis in libero qui earum rem facilis optio culpa nobis magnam commodi. Sunt aspernatur obcaecati eos expedita aperiam magnam ipsum incidunt impedit?</p>
    <div>
        <ItemList v-if="data" :items="features" />
        <template v-else-if="loading">loading...</template>
        <template v-else-if="error">Network error: {{ error }}</template>
    </div>
</template>

<style lang="scss" scoped>

</style>