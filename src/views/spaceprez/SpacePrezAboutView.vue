<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "About SpacePrez | Prez";
    ui.pageHeading = { name: "SpacePrez", url: "/s" };
    ui.breadcrumbs = [{ name: getPrezSystemLabel("SpacePrez") + " Home", url: "/s" }, { name: "About", url: "/s/about" }];
});
</script>

<template>
    <h1 class="page-title">About SpacePrez</h1>
    <p>
        SpacePrez is a read-only web delivery system - web pages and API - for spatial data. It complies with
        <a href="https://w3c.github.io/dx-connegp/connegp/" target="_blank" rel="noopener noreferrer">Content Negotiation by
            Profile</a>
        and also implements the Open Geospatial Consortium's <a href="https://docs.ogc.org/is/17-069r3/17-069r3.html">OGC
            API:Features</a> for spatial data.
    </p>
    <h2>Use</h2>
    <p>
        The basic structure of SpacePrez is:
    </p>
    <pre style="background-color: white">
            /                                       - API Home

            /datasets                               - list of Datasets

            /dataset/{id}                           - a Dataset

            /dataset/{id}/collections               - list of a Dataset's Feature Collections

            /dataset/{id}/collection/{id}           - a Feature Collection

            /dataset/{id}/collection/{id}/items     - a Feature Collection's Features

            /dataset/{id}/collection/{id}/item/{id} - a Feature
        </pre>
    <p>Navigation to any of those endpoints delivers content in HTML, for humans, and either JSON or GeoJSON, for machines.
    </p>
    <p>
        Additionally, this API provides <em>alternate profiles</em> of all content, and those profiles - data
        models - also come in other formats, such as <a href="https://www.w3.org/RDF/">RDF</a>.
    </p>
    <p>
        In addition to the standard GC API endpoints, there are also convenience endpoints for searching and applying
        CQL or SPARQL queries.
    </p>
    <p>
        SpacePrez' data is all natively stored in RDF graph form, according to the <a
            href="https://opengeospatial.github.io/ogc-geosparql/geosparql11/spec.html">GeoSPARQL 1.1</a>
        ontology and any specialisations defined for particular systems.
    </p>
</template>

<style lang="scss" scoped></style>