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

const resources: ItemExtra[] = [
    {
        label: {
            value: "Resource 1",
            termType: "literal"
        },
        iri: "https://example.com/resource1",
        links: ["/c/catalogs/1/resources/1"],
        termType: "node"
    },
    {
        label: {
            value: "Resource 2",
            termType: "literal"
        },
        iri: "https://example.com/resource2",
        links: ["/c/catalogs/2/resources/1"],
        termType: "node"
    },
    {
        label: {
            value: "Resource 3",
            termType: "literal"
        },
        iri: "https://example.com/resource3",
        links: ["/c/catalogs/3/resources/1"],
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
    <h1>Resources</h1>
    <PrezUIItemList :items="resources" :predicates="predicates" />
</template>

<style lang="scss" scoped></style>