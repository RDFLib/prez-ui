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
    "http://purl.org/dc/terms/title"
];

const properties = ref([]);
const catalog = ref({});
const parts = ref([]);

onMounted(() => {
    doRequest(`${apiBaseUrl}/c/catalogs/${route.params.catalogId}`, () => {
        parseIntoStore(data.value);
        
        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Catalog")))[0];
        catalog.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === qname("dcterms:title")) {
                catalog.value.title = q.object.value;
            } else if (q.predicate.value === qname("dcterms:description")) {
                catalog.value.description = q.object.value;
            }
            q.predicate.annotations = store.value.getQuads(q.predicate, null, null);
            properties.value.push(q);
        }, subject, null, null);
        
        store.value.forObjects(part => {
            let p = {
                iri: part.id
            }
            store.value.forEach(q => {
                if (q.predicate.value === qname("rdfs:label")) {
                    p.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    p.link = q.object.value;
                }
            }, part, null, null);
            parts.value.push(p);
        }, namedNode(catalog.value.iri), namedNode(qname("dcterms:hasPart")));

        ui.rightNavConfig = { enabled: true, profiles: profiles, currentUrl: route.path };
        document.title = `${catalog.value.title} | Prez`;
        ui.pageHeading = { name: "CatPrez", url: "/c"};
        ui.breadcrumbs = [{ name: "CatPrez", url: "/c" }, { name: "Catalogs", url: "/c/catalogs" }, { name: catalog.value.title, url: route.path }];
    });
});
</script>

<template>
    <h1>{{ catalog.title }}</h1>
    <p>Instance IRI: <a :href="catalog.iri" target="_blank" rel="noopener noreferrer">{{ catalog.iri }}</a></p>
    <p v-if="!!catalog.description">{{ catalog.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds">
        <template #bottom>
            <tr>
                <th>Has Part</th>
                <td>
                    <div class="resource-list">
                        <RouterLink v-for="part in parts" :to="part.link || ''">{{ part.title ? part.title : part.iri }}</RouterLink>
                    </div>
                </td>
            </tr>
        </template>
    </PropTable>
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>
.resource-list {
    display: flex;
    flex-direction: column;
}
</style>