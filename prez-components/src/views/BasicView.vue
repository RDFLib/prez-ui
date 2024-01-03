<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { literalLang, literalDatatype, literalGeom, node, nodeLink, nodePredicate, blankNode } from "../util/storyData";
import PrezUILiteral from "../components/PrezUILiteral.vue";
import PrezUINode from "../components/PrezUINode.vue";
import PrezUIBlankNode from "../components/PrezUIBlankNode.vue";

const table = [
    {
        predicate: nodePredicate,
        object: [
            literalLang,
            literalDatatype,
            literalGeom,
            node,
            nodeLink,
            blankNode
        ]
    }
];
</script>

<template>
    <h3>Literals</h3>
    <PrezUILiteral v-bind="literalLang" />
    <PrezUILiteral v-bind="literalDatatype" />
    <PrezUILiteral v-bind="literalGeom" />
    <h3>Nodes</h3>
    <PrezUINode v-bind="node" showType showProv />
    <h3>Blank Nodes</h3>
    <PrezUIBlankNode v-bind="blankNode" showProv showType />
    <h3>Table</h3>
    <DataTable :value="table" stripedRows tableStyle="min-width: 50rem">
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
                    <PrezUIBlankNode v-else-if="o.rdfType === 'blanknode'" v-bind="o" showProv showType />
                </template>
            </template>
        </Column>
    </DataTable>
</template>
