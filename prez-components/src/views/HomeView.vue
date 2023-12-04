<script lang="ts" setup>
import TestButton from "../components/TestButton.vue";
import ListTable from "../components/ListTable.vue";
import ObjectTable from "../components/ObjectTable.vue";

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

const item = {
    uri: "some URI",
    label: "an object",
    description: "a description",
    properties: [
        {
            predicate: "p1",
            object: "o1"
        },
        {
            predicate: "p2",
            object: "o2"
        },
        {
            predicate: "p3",
            object: "o3"
        },
    ]
}
</script>

<template>
    <div>
        <TestButton>Button</TestButton>
        <ListTable :items="items" :predicates="predicates" />
        <ObjectTable v-bind="item" />
    </div>
</template>
