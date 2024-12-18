<script lang="ts" setup>
import { ItemProfiles, type ItemProfilesProps } from "prez-components-test";

const props = defineProps<ItemProfilesProps>();
const itemLink = resolveComponent("ItemLink") as Component;
const loading = resolveComponent("Loading") as Component;
</script>

<template>
    <ItemProfiles v-bind="props" :_components="{itemLink, loading}" />
</template>
