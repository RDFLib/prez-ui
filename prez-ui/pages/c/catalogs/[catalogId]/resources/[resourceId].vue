<script lang="ts" setup>
import type { PrezNode, PrezProperty } from 'prez-components';
import PrezUIObjectTable from '~/components/PrezUIObjectTable.vue';

interface Item extends PrezNode {
    properties: PrezProperty[]
};

const resource: Item = {
    label: {
        value: "Resource 1",
        termType: "literal"
    },
    iri: "https://example.com/resource1",
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
    <h1>{{ resource.label?.value || resource.iri }}</h1>
    <p v-if="resource.description"><em>{{ resource.description }}</em></p>
    <PrezUIObjectTable :properties="resource.properties" />
</template>

<style lang="scss" scoped>

</style>