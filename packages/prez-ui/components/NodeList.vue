<script lang="ts" setup>
import { NodeList, type NodeListProps } from "prez-components-test";

const props = defineProps<NodeListProps>();
const node = resolveComponent("Node") as Component;
</script>

<template>
    <NodeList v-bind="props" :_components="{node}" />
</template>
