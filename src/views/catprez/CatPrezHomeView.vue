<script lang="ts" setup>
import FlavourHome from "@/components/FlavourHome.vue";

const links = [
    {
        label: "Catalogs",
        url: "/c/catalogs",
        description: "A list of DCAT Catalogs"
    }
];
</script>

<template>
    <FlavourHome flavour="CatPrez" :links="links">
        <p>Welcome to CatPrez - a read-only web delivery system for Data Catalog Vocabulary (DCAT) information.</p>
    </FlavourHome>
</template>

<style lang="scss" scoped>

</style>