<script lang="ts" setup>
import { ArrowRight } from "lucide-vue-next";
</script>

<template>
    <NuxtLayout contentonly>
        <template #default>
            <div class="flex flex-row gap-3 items-center mt-2 mb-6">
                <img src="/prez-logo.png" alt="Prez logo" class="w-[60px]">
                <h1 class="text-3xl">Welcome to Prez</h1>
            </div>
            <p>Prez is a <a href="https://www.w3.org/standards/semanticweb/data" target="_blank" rel="noopener noreferrer">Linked Data</a> API with support for multiple data formats (JSON, CSV, JSON-LD, Turtle, RDF/XML).</p>
            <h3 class="text-xl mt-6">Data Catalog</h3>
            <p>General data catalog structured using DCAT metadata format.</p>
            <h3 class="text-xl mt-6">Spatial Data Catalog</h3>
            <p>Spatial data catalog of GeoSPARQL spatial features with an API conforming to the OGC API specification. Uses DCAT for catalog metadata.</p>
            <h3 class="text-xl mt-6">Vocabularies</h3>
            <p>A well-structured set of SKOS vocabularies conforming to the VocPub profile.</p>
            <Button class="my-4" as-child>
                <NuxtLink to="/catalogs">Go to catalogs <ArrowRight class="size-4" /></NuxtLink>
            </Button>
        </template>
    </NuxtLayout>
</template>