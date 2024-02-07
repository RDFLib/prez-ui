<script lang="ts" setup>
import type { ItemExtra, PrezNode } from "prez-components";
import PrezUIItemList from "~/components/PrezUIItemList.vue";

const predicates: PrezNode[] = [
    {
        label: {
            value: "Publisher",
            termType: "literal"
        },
        iri: "https://example.com/publisher",
        description: {
            value: "Publisher description",
            termType: "literal"
        },
        termType: "node"
    },
    {
        label: {
            value: "Issued",
            termType: "literal"
        },
        iri: "https://example.com/issued",
        description: {
            value: "Issued description",
            termType: "literal"
        },
        termType: "node"
    },
    {
        label: {
            value: "Created",
            termType: "literal"
        },
        iri: "https://example.com/created",
        description: {
            value: "Created description",
            termType: "literal"
        },
        termType: "node"
    },
];

const childButton = {
    suffix: "/resources",
    label: "Resources"
};

const catalogs: ItemExtra[] = [
    {
        label: {
            value: "Catalog 1",
            termType: "literal"
        },
        iri: "https://example.com/catalog1",
        links: ["/c/catalogs/1"],
        termType: "node"
    },
    {
        label: {
            value: "Catalog 2",
            termType: "literal"
        },
        iri: "https://example.com/catalog2",
        links: ["/c/catalogs/2"],
        termType: "node"
    },
    {
        label: {
            value: "Catalog 3",
            termType: "literal"
        },
        iri: "https://example.com/catalog3",
        links: ["/c/catalogs/3"],
        extras: {
            "https://example.com/created": {
                value: "2024-01-24",
                termType: "literal"
            },
        },
        termType: "node"
    },
];
</script>

<template>
    <h1>Catalogs</h1>
    <PrezUIItemList :items="catalogs" :predicates="predicates" :childButton="childButton" />
</template>

<style lang="scss" scoped></style>