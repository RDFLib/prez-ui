<script lang="ts" setup>
import { SearchResults, type SearchResultsProps } from "prez-components";

const props = defineProps<SearchResultsProps>();
const node = resolveComponent("Node") as Component;
const term = resolveComponent("Term") as Component;
const literal = resolveComponent("Literal") as Component;
const itemLink = resolveComponent("ItemLink") as Component;
</script>

<template>
    <SearchResults v-bind="props" :_components="{node, term, literal, itemLink}" />
</template>
