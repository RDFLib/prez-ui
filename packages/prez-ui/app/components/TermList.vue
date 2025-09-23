<script lang="ts" setup>
import { TermList, type TermListProps } from "prez-components";

const props = defineProps<TermListProps>();
const node = resolveComponent("Node") as Component;
const literal = resolveComponent("literal") as Component;
const nodeList = resolveComponent("NodeList") as Component;
</script>

<template>
    <TermList v-bind="props" :_components="{node, literal, nodeList}" />
</template>
