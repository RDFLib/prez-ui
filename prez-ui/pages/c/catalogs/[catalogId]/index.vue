<script lang="ts" setup>
import type { PrezItemPage } from "prez-components";
import type ItemLayout from "~/components/ItemLayout.vue";

const route = useRoute();

const catalog: PrezItemPage = {
    focusNode: {
        label: {
            value: "Catalog 1",
            termType: "literal"
        },
        iri: "https://example.com/catalog1",
        // members: [
        //     {
        //         link: "",
        //         label: ""
        //     }
        // ],
        termType: "node"
    },
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
    <ItemLayout v-bind="catalog" />
    <NuxtLink :to="route.path + '/resources'">Resources</NuxtLink>
</template>

<style lang="scss" scoped>

</style>