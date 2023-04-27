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
        <p>
            The vocabularies are provided as a read-only web delivery system, providing a standardised set of profiles 
            in both human and machine-readable views. See the available profiles <RouterLink to="/v/profiles">here</RouterLink>.
        </p>
        <p>
            More specifically, the vocabularies defined in this system conform to the VocPub profile,
            which itself is an opinionated profile of the SKOS (Simple Knowledge Organisation System) data model.
        </p>
        <h2>Vocabularies</h2>
        <p>
            A vocabulary (concept scheme) is a hierarchical list of terms (concepts).
        </p>
        <p>
            See the <RouterLink to="/v/vocab">Vocabularies Register</RouterLink> for a list of vocabularies.
        </p>
        <h2>Collections</h2>
        <p>
            A collectionis a flat grouping of terms (concepts).
        </p>
        <p>
            See the <RouterLink to="/v/collection">Collections page</RouterLink> for a list of collections.
        </p>
        <h2>Concepts</h2>
        <p>
            Vocabulary terms (concepts) are listed within a vocabulary's home page. Each vocabulary presents both a
            concept hierarchy (tree) view and a link to a flat list of its concepts.
        </p>
        <h2>Search and Querying</h2>
        <p>
            You can search for concepts within one vocabulary or across all vocabularies.
        </p>
        <ul>
            <li>To search across vocabularies, use the search bar above.</li>
            <li>To search across the entire Prez system, use the <RouterLink to="/search">Advanced Search</RouterLink>.</li>
            <li>To perform custom queries, use the SPARQL query language on the <RouterLink to="/sparql">SPARQL page</RouterLink></li>
        </ul>
</FlavourHome></template>

<style lang="scss" scoped></style>