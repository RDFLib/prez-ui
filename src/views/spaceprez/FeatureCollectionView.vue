<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import PropTable from "@/components/PropTable.vue";

const { namedNode } = DataFactory;

// const profileData = `PREFIX altr-ext: <http://www.w3.org/ns/dx/conneg/altr-ext#>
// PREFIX dcterms: <http://purl.org/dc/terms/>
// PREFIX prof: <http://www.w3.org/ns/dx/prof/>
// PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

// <https://w3id.org/profile/vocpub>
//     a prof:Profile ;
//     dcterms:description "This is a profile of the taxonomy data model SKOS - i.e. SKOS with additional constraints." ;
//     dcterms:identifier "vocpub" ;
//     dcterms:title "VocPub" ;
//     altr-ext:hasDefaultResourceFormat "text/html" ;
//     altr-ext:hasResourceFormat
//         "application/ld+json" ,
//         "application/rdf+xml" ,
//         "text/html" ,
//         "text/turtle" ;
// .

// <https://www.w3.org/TR/vocab-dcat/>
//     a prof:Profile ;
//     dcterms:description "collection collection Vocabulary (DCAT) is a W3C-authored RDF vocabulary designed to facilitate interoperability between data collections" ;
//     dcterms:identifier "dcat" ;
//     dcterms:title "DCAT" ;
//     altr-ext:hasDefaultResourceFormat "text/html" ;
//     altr-ext:hasResourceFormat
//         "application/ld+json" ,
//         "application/rdf+xml" ,
//         "text/html" ,
//         "text/turtle" ;
// .

// <https://w3id.org/profile/dd>
//     a prof:Profile ;
//     dcterms:description "A simple data model to provide items for form drop-down lists. The basic information is an ID & name tuple and the optional extra value is an item's parent. For vocabularies, this is then URI, prefLabel or URI, prefLabel & broader Concept" ;
//     dcterms:identifier "dd" ;
//     dcterms:title "Drop-Down List" ;
//     altr-ext:hasDefaultResourceFormat "application/json" ;
//     altr-ext:hasResourceFormat
//         "application/json" ,
//         "text/csv"
// .

// altr-ext:alt-profile
//     a prof:Profile ;
//     dcterms:description "The representation of the resource that lists all other representations (profiles and Media Types)" ;
//     dcterms:identifier "alt" ;
//     dcterms:title "Alternates Profile" ;
//     altr-ext:hasDefaultResourceFormat "text/html" ;
//     altr-ext:hasResourceFormat
//         "application/ld+json" ,
//         "application/rdf+xml" ,
//         "text/html" ,
//         "text/turtle" ;
// .`;

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
const collection = ref({});

onMounted(() => {
    doRequest(`${apiBaseUrl}/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode("http://www.opengis.net/ont/geosparql#FeatureCollection"))[0];
        collection.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === "http://purl.org/dc/terms/title") {
                collection.value.title = q.object.value;
            } else if (q.predicate.value === "http://purl.org/dc/terms/description") {
                collection.value.description = q.object.value;
            }
            properties.value.push(q);
        }, subject, null, null);
    
        ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
        document.title = `${collection.value.title} | Prez`;
        ui.pageHeading = { name: "SpacePrez", url: "/s"};
        ui.breadcrumbs = [
            { name: "SpacePrez", url: "/s" },
            { name: "Datasets", url: "/s/datasets" },
            { name: "Dataset", url: `/s/datasets/${route.params.datasetId}` },
            { name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` },
            { name: collection.value.title, url: route.path }
        ];
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
                <th>Members</th>
                <td>
                    <RouterLink :to="`${route.path}/items`" class="btn">Features</RouterLink>
                </td>
            </tr>
        </template>
    </PropTable>
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>

</style>