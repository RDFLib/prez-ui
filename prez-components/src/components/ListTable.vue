<script lang="ts" setup>
import { RouterLink } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ListTableProps } from "../types";

const props = defineProps<ListTableProps>();
</script>

<template>
    <DataTable :value="props.items" stripedRows tableStyle="min-width: 50rem">
        <Column field="label" header="Label" sortable>
            <template #body="slotProps">
                <RouterLink v-if="slotProps.data.link" :to="slotProps.data.link">{{ slotProps.data.label || slotProps.data.uri }}</RouterLink>
                <template v-else>{{ slotProps.data.label || slotProps.data.uri }}</template>
            </template>
        </Column>
        <Column v-for="predicate in props.predicates" :field="`extras.${predicate.label}`" :header="predicate.label" sortable></Column>
    </DataTable>
</template>

<style lang="scss" scoped>

</style>