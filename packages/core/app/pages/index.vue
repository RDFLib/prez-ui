<template>
    <NuxtLayout contentonly>
        <template #default>
            <h1 class="text-2xl mt-8">Welcome to Prez</h1>
            <p>Prez is a Linked Data API with support for multiple data formats (JSON, CSV, JSON-LD, Turtle, RDF/XML).</p>
            <div class="prez-card-container">
                <h3 class="text-xl pt-8">Data Catalog</h3>
                <p>General data catalog structured using DCAT metadata format.</p>
                <h3 class="text-xl pt-8">Spatial Data Catalog</h3>
                <p>Spatial data catalog of GeoSPARQL spatial features with an API conforming to the OGC API specification. Uses DCAT for catalog metadata.</p>
                <h3 class="text-xl pt-8">Vocabularies</h3>
                <p>A well-structured set of SKOS vocabularies conforming to the VocPub profile.</p>
            </div>
        </template>
    </NuxtLayout>
</template>