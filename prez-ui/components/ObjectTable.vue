<script lang="ts" setup>
import { ObjectTable, type ObjectTableProps } from "prez-components";

const props = defineProps<ObjectTableProps>();
</script>

<template>
    <ObjectTable v-bind="props" />
</template>