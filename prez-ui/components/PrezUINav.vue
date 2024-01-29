<script lang="ts" setup>
import { PrezUINav } from "prez-components";

const props = withDefaults(defineProps<{
    sidenav: boolean;
}>(), {
    sidenav: true
});
</script>

<template>
    <PrezUINav v-bind="props" />
</template>