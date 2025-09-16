<script lang="ts" setup>
import { Literal, type LiteralProps } from "prez-components";

const props = defineProps<LiteralProps>();
const term = resolveComponent("Term") as Component;
</script>
<script lang="ts">
export default {
    inheritAttrs: false
}
</script>

<template>
    <Literal v-bind="props" :_components="{term}">
        <template #default="slotProps"><slot v-bind="slotProps" /></template>
        <template #text="slotProps"><slot name="text" v-bind="slotProps" /></template>
        <template #language="slotProps"><slot name="language" v-bind="slotProps" /></template>
        <template #datatype="slotProps"><slot name="datatype" v-bind="slotProps" /></template>
    </Literal>
</template>
