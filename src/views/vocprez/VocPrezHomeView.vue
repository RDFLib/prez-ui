<script lang="ts" setup>
import { RouterLink } from "vue-router";
import FlavourHome from "@/components/FlavourHome.vue";

const links = [
    {
        label: "Vocabularies",
        url: "/v/vocab",
        description: "A list of SKOS vocabularies"
    },
    {
        label: "Collections",
        url: "/v/collection",
        description: "A list of SKOS collections"
    }
];
</script>

<template>
    <FlavourHome flavour="VocPrez" :links="links">
        <p>Welcome to VocPrez - a read-only web delivery system for Simple Knowledge Organization System (SKOS)-formulated
            RDF vocabularies.</p>
        <p>VocPrez presents different views of vocabularies from a list of RDF sources. This system currently implements
            sources from local files, Research Vocabularies Australia and VocBench.</p>
        <h2>Vocabularies</h2>
        <p>
            Vocabularies (or ConceptSchemes) contain a hierarchical list of terms (or Concepts).
        </p>
        <p>
            See the <RouterLink to="/v/vocab">Vocabularies Register</RouterLink> for a list of vocabularies this
            instance of VocPrez knows about.
        </p>
        <h2>Collections</h2>
        <p>
            Collections are a grouping of terms (or Concepts), represented as a flat listing of Concepts.
        </p>
        <p>
            See the <RouterLink to="/v/collection">Collections page</RouterLink> for a list of collections this
            instance of VocPrez knows about.
        </p>
        <h2>Concepts</h2>
        <p>
            Vocabulary terms (or Concepts) are listed within a vocabulary's home page. Each vocabulary presents both a
            concept hierarchy (tree) view and a link to a flat list of its concepts.
        </p>
        <h2>Search and Querying</h2>
        <p>
            You can search for Concepts within one vocab or across all vocabularies by using the search bar below or the <RouterLink to="/search">Advanced Search page</RouterLink>, or perform SPARQL queries using the <RouterLink to="/sparql">SPARQL page</RouterLink>.
        </p>
</FlavourHome></template>

<style lang="scss" scoped></style>