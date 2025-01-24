<script lang="ts" setup>
import { ItemBreadcrumb, type ItemBreadcrumbProps } from "prez-components";

const props = defineProps<ItemBreadcrumbProps>();
const literal = resolveComponent("Literal") as Component;
const itemLink = resolveComponent("ItemLink") as Component;
</script>

<template>
    <ItemBreadcrumb v-bind="props" :_components="{literal, itemLink}" />
</template>
