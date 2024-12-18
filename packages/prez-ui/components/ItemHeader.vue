<script lang="ts" setup>
import { ItemHeader, type ItemHeaderProps } from "prez-components-test";

const props = defineProps<ItemHeaderProps>();
const literal = resolveComponent("Literal") as Component;
const node = resolveComponent("Node") as Component;
</script>

<template>
    <ItemHeader v-bind="props" :_components="{literal, node}" />
</template>
