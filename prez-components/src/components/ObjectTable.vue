<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ObjectTableProps } from "../types";

const props = defineProps<ObjectTableProps>();
</script>

<template>
    <DataTable :value="props.properties" stripedRows tableStyle="min-width: 50rem">
        <Column field="predicate"></Column>
        <Column field="object"></Column>
    </DataTable>
</template>

<style lang="scss" scoped>

</style>