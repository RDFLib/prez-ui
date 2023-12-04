<script lang="ts" setup>
import { ListTable, type ListTableProps } from "prez-components";

const props = defineProps<ListTableProps>();
</script>

<template>
    <ListTable v-bind="props" />
</template>