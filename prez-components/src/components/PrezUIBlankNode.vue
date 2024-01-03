<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Card from "primevue/card";
import { PrezUIBlankNodeProps } from "../types"
import PrezUILiteral from "./PrezUILiteral.vue";
import PrezUINode from "./PrezUINode.vue";

const props = defineProps<PrezUIBlankNodeProps>();
</script>

<template>
    <Card>
        <template #content>
            <DataTable :value="props.properties" stripedRows tableStyle="min-width: 50rem">
                <Column field="predicate" headerStyle="display: none;">
                    <template #body="slotProps">
                        <PrezUINode v-bind="slotProps.data.predicate" showProv />
                    </template>
                </Column>
                <Column field="object" headerStyle="display: none;">
                    <template #body="slotProps">
                        <template v-for="o in slotProps.data.object">
                            <PrezUINode v-if="o.rdfType === 'node'" v-bind="o" showProv showType />
                            <PrezUILiteral v-else-if="o.rdfType === 'literal'" v-bind="o" />
                            <PrezUIBlankNode v-else-if="o.rdfType === 'blanknode'" v-bind="o" />
                        </template>
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>

<style lang="scss" scoped>

</style>