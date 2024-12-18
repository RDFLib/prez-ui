<script lang="ts" setup>
import { ItemList, type ItemListProps } from "prez-components-test";

const props = defineProps<ItemListProps>();
const predicate = resolveComponent("Predicate") as Component;
const node = resolveComponent("Node") as Component;
const objects = resolveComponent("Objects") as Component;
</script>

<template>
    <ItemList v-bind="props" :_components="{predicate, node, objects}" />
</template>
