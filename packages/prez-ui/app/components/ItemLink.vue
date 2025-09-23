<script lang="ts" setup>
import { ItemLink, type ItemLinkProps } from "prez-components";

const props = defineProps<ItemLinkProps>();
const copyButton = resolveComponent("CopyButton") as Component;
</script>
<script lang="ts">
export default {
    inheritAttrs: false
}
</script>

<template>
    <ItemLink v-bind="props" :_components="{copyButton}">
        <template #default="slotProps"><slot v-bind="slotProps" /></template>
        <template #wrapper="slotProps"><slot name="wrapper" v-bind="slotProps" /></template>
    </ItemLink>
</template>
