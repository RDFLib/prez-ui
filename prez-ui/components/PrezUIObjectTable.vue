<script lang="ts" setup>
import { PrezUIObjectTable, type PrezUIObjectTableProps } from "prez-components";

const props = defineProps<PrezUIObjectTableProps>();
</script>

<template>
    <PrezUIObjectTable v-bind="props" />
</template>