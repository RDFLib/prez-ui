<script lang="ts" setup>
import { RouterLink } from "vue-router";
import FlavourHome from "@/components/FlavourHome.vue";

const links = [
    {
        label: "Datasets",
        url: "/s/datasets",
        description: "A list of DCAT Datasets"
    },
    {
        label: "Conformance",
        url: "/s/conformance"
    }
];
</script>

<template>
    <FlavourHome flavour="SpacePrez" :links="links">
        <p>Welcome to SpacePrez, the next version of OGC LD API. SpacePrez, which is an API tuned for Semantic Web spatial
            data, uses a common set of components with <RouterLink to="/v">VocPrez</RouterLink>, which is an API tuned for
            Semantic Web vocabularies.</p>
        <h2>Datasets</h2>
        <p>
            Datasets are packages of data usually managed as one. Datasets, in SpacePrez, may contain multiple Feature
            Collections. SpacePrez can deliver multiple datasets at once and the data from them is cross-queryable thus
            SpacePrez is a catalogue of integrated spatial datasets.
        </p>
        <p>See the <RouterLink to="/s/datasets">Datasets page</RouterLink> for a list of Datasets for this SpacePrez
            instance.</p>
        <h2>Feature Collections</h2>
        <p>
            Datasets may have collections of more than one type of Feature and these are presented in "Feature Collections".
            SpacePrez' data model uses the <a
                href="https://opengeospatial.github.io/ogc-geosparql/geosparql11/spec.html#_class_geofeaturecollection"
                target="_blank" rel="noopener noreferrer">GeoSPARQL 1.1 FeatureCollection</a> class to represent these and
            delivers them as OGC API feature collections.
        </p>
        <h2>Features</h2>
        <p>
            Features are spatial objects about which we want to know things, including their geometry/geometries. SpacePrez'
            data model uses the <a
            href="https://opengeospatial.github.io/ogc-geosparql/geosparql11/spec.html#_class_geofeature"
            target="_blank" rel="noopener noreferrer">GeoSPARQL 1.1 Feature</a> class to represent features and they are
        the main "items" within Feature Collections.
    </p>
    <h2>Search &amp; Querying</h2>
    <p>Performing SPARQL queries can be done by using the <RouterLink to="/sparql">SPARQL page</RouterLink>. Use the search bar below or use the <RouterLink to="/search">Advanced Search page</RouterLink> to search for items within this SpacePrez instance. Spatial search will be implemented soon.</p>
</FlavourHome></template>

<style lang="scss" scoped></style>