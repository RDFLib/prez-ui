<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { PrezUIObjectTableProps } from "../types"
import PrezUILiteral from "./PrezUILiteral.vue";
import PrezUINode from "./PrezUINode.vue";
import PrezUIBlankNode from "./PrezUIBlankNode.vue";

const props = defineProps<PrezUIObjectTableProps>();
</script>

<template>
    <DataTable :value="props.properties" stripedRows tableStyle="min-width: 50rem">
        <Column field="predicate" headerStyle="display: none;" bodyStyle="min-width: 180px;">
            <template #body="slotProps">
                <PrezUINode v-bind="slotProps.data.predicate" showProv />
            </template>
        </Column>
        <Column field="object" headerStyle="display: none;">
            <template #body="slotProps">
                <template v-for="o in slotProps.data.object">
                    <PrezUINode v-if="o.termType === 'node'" v-bind="o" showProv showType />
                    <PrezUILiteral v-else-if="o.termType === 'literal'" v-bind="o" />
                    <PrezUIBlankNode v-else-if="o.termType === 'blanknode'" v-bind="o" />
                </template>
            </template>
        </Column>
    </DataTable>
</template>

<style lang="scss" scoped>

</style>