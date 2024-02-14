<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { PrezUIObjectTableProps } from "../types"
import PrezUINode from "./PrezUINode.vue";
import PrezUITerm from "./PrezUITerm.vue";

const props = defineProps<PrezUIObjectTableProps>();
</script>

<template>
    <DataTable :value="Object.values(props.properties)" stripedRows tableStyle="min-width: 50rem">
        <Column field="predicate" headerStyle="display: none;" bodyStyle="min-width: 180px;">
            <template #body="slotProps">
                <PrezUINode v-bind="slotProps.data.predicate" showProv />
            </template>
        </Column>
        <Column field="object" headerStyle="display: none;">
            <template #body="slotProps">
                <PrezUITerm v-for="o in slotProps.data.objects" v-bind="o" showProv showType />
            </template>
        </Column>
    </DataTable>
</template>

<style lang="scss" scoped>

</style>