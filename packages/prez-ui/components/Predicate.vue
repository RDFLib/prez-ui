<script lang="ts" setup>
import { Predicate, type PredicateProps } from "prez-components-test";

const props = defineProps<PredicateProps>();
const node = resolveComponent("Node") as Component;
</script>

<template>
    <Predicate v-bind="props" :_components="{node}">
        <template #default="slotProps"><slot v-bind="slotProps" /></template>
    </Predicate>
</template>
