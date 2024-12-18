<script lang="ts" setup>
import { ItemTableRow, type ItemTableRowProps } from "prez-components-test";

const props = defineProps<ItemTableRowProps>();
const predicate = resolveComponent("Predicate") as Component;
const objects = resolveComponent("Objects") as Component;
</script>

<template>
    <ItemTableRow v-bind="props" :_components="{predicate, objects}">
        <template #row="slotProps"><slot name="row" v-bind="slotProps" /></template>
        <template #columns="slotProps"><slot name="columns" v-bind="slotProps" /></template>
    </ItemTableRow>
</template>
