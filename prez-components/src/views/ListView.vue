<script lang="ts" setup>
import ListTable from "../components/ListTable.vue";

const items = [
    {
        uri: "uri 1",
        label: "label 1",
        link: "link 1",
        description: "description 1",
    },
    {
        uri: "uri 2",
        label: "label 2",
        link: "link 2",
        description: "description 2",
    },
    {
        uri: "uri 3",
        label: "label 3",
        link: "link 3",
        description: "description 3",
        extras: {
            publisher: "me"
        }
    },
];

const predicates = [
    {
        label: "publisher",
        uri: "https://example.com/publisher"
    },
    {
        label: "issued",
        uri: "https://example.com/issued"
    },
    {
        label: "created",
        uri: "https://example.com/created"
    },
];
</script>

<template>
    <div>
        <ListTable :items="items" :predicates="predicates" />
    </div>
</template>
