<script lang="ts" setup>
import { ItemTable, type ItemTableProps } from "prez-components";

const props = defineProps<ItemTableProps>();
const itemTableRow = resolveComponent("ItemTableRow") as Component;
</script>

<template>
    <ItemTable v-bind="props" :_components="{itemTableRow}" />
</template>
