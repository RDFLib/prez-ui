<script lang="ts" setup>
//import FlavourHome from "@/components/FlavourHome.vue";
import CatPrezSearchMap from '@/components/search/CatPrezSearchMap.vue'

const links = [
    {
        label: "Catalogs",
        url: "/c/catalogs",
        description: "A list of DCAT Catalogs"
    }
];

</script>

<template>

    <h1>Data Catalog</h1>
    <p>
        A general data catalog conforming to <a href="https://www.w3.org/TR/vocab-dcat-2/">DCAT</a>, delivered 
        as a read-only web system in both human and machine-readable views.
        The views are known as profiles and a list of them are available <RouterLink to="/s/profiles">here</RouterLink>.
    </p>
    <!-- <p>Welcome to CatPrez - a read-only web delivery system for Data Catalog Vocabulary (DCAT) information.</p> -->

    <CatPrezSearchMap />
</template>

<style lang="scss" scoped>

</style>