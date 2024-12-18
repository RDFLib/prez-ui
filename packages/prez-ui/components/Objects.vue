<script lang="ts" setup>
import { Objects, type ObjectsProps } from "prez-components-test";

const props = defineProps<ObjectsProps>();
const term = resolveComponent("Term") as Component;
</script>

<template>
    <Objects v-bind="props" :_components="{term}">
        <template #default="slotProps"><slot v-bind="slotProps" /></template>
    </Objects>
</template>
