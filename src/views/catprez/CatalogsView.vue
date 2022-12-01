<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import ItemList from "@/components/ItemList.vue";

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
//     dcterms:description "Dataset Catalog Vocabulary (DCAT) is a W3C-authored RDF vocabulary designed to facilitate interoperability between data catalogs" ;
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

const catalogs = ref([]);

const { data, profiles, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/c/catalogs`, () => {
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
                    c.link = `/c/catalogs/${q.object.value}`;
                }
            }, member, null, null);
            catalogs.value.push(c);
        }, subject, namedNode(qname("rdfs:member")));
    });

    ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
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