<script lang="ts" setup>
import { Node, type NodeProps } from "prez-components-test";

const props = defineProps<NodeProps>();
const itemLink = resolveComponent("ItemLink") as Component;
</script>

<template>
    <Node v-bind="props" :_components="{itemLink}">
        <template #default="slotProps"><slot v-bind="slotProps" /></template>
        <template #wrapper="slotProps"><slot name="wrapper" v-bind="slotProps" /></template>
    </Node>
</template>
