<script lang="ts" setup>
import { Term, type TermProps } from "prez-components";

const props = defineProps<TermProps>();
const literal = resolveComponent("Literal") as Component;
const node = resolveComponent("Node") as Component;
const nodeList = resolveComponent("NodeList") as Component;
const itemTable = resolveComponent("ItemTable") as Component;
const termList = resolveComponent("TermList") as Component;
</script>

<template>
    <Term v-bind="props" :_components="{literal, node, nodeList, itemTable, termList}" />
</template>
