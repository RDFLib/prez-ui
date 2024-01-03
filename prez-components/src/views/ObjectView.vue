<script lang="ts" setup>
import ObjectTable from "../components/ObjectTable.vue";

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
        <ObjectTable v-bind="item" />
    </div>
</template>
