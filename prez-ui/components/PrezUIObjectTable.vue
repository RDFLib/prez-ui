<script lang="ts" setup>
import { PrezUIObjectTable, type PrezUIObjectTableProps } from "prez-components";

const props = withDefaults(defineProps<PrezUIObjectTableProps>(), {
    hideHidden: true
});
</script>

<template>
    <PrezUIObjectTable v-bind="props" />
</template>