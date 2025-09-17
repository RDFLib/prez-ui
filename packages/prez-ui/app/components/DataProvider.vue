<script lang="ts" setup>
import { DataProvider, type DataProviderProps } from "prez-components";

const props = defineProps<DataProviderProps>();
const loading = resolveComponent("Loading") as Component;
const message = resolveComponent("Message") as Component;
</script>

<template>
    <DataProvider v-bind="props" :_components="{loading, message}">
        <template #loading="slotProps"><slot name="loading" v-bind="slotProps" /></template>
        <template #error="slotProps"><slot name="error" v-bind="slotProps" /></template>
        <slot />
    </DataProvider>
</template>
