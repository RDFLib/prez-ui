<script lang="ts" setup>
import type { PrezNode, TableProperty } from 'prez-components';
import PrezUIObjectTable from '~/components/PrezUIObjectTable.vue';

interface Item extends PrezNode {
    properties: TableProperty[]
};

const route = useRoute();

const catalog: Item = {
    label: {
        value: "Catalog 1",
        termType: "literal"
    },
    iri: "https://example.com/catalog1",
    properties: [
        {
            predicate: {
                label: {
                    value: "Predicate 1",
                    termType: "literal"
                },
                iri: "https://example.com/predicate1",
                termType: "node"
            },
            object: [
                {
                    value: "Object 1",
                    termType: "literal"
                }
            ]
        }
    ],
    termType: "node"
}
</script>

<template>
    <h1>{{ catalog.label?.value || catalog.iri }}</h1>
    <p v-if="catalog.description"><em>{{ catalog.description }}</em></p>
    <NuxtLink :to="route.path + '/resources'">Resources</NuxtLink>
    <PrezUIObjectTable :properties="catalog.properties" />
</template>

<style lang="scss" scoped>

</style>