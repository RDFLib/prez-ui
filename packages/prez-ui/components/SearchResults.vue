<script lang="ts" setup>
import { SearchResults, type SearchResultsProps } from "prez-components-test";

const props = defineProps<SearchResultsProps>();
const node = resolveComponent("Node") as Component;
const term = resolveComponent("Term") as Component;
const literal = resolveComponent("Literal") as Component;
</script>

<template>
    <SearchResults v-bind="props" :_components="{node, term, literal}" />
</template>
