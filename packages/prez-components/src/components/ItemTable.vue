<script lang="ts" setup>
import { type PrezFocusNode } from 'prez-lib-test';
import { Table, TableBody } from '@/components/ui/table';
import { ItemTableProps } from "@/types";
import ItemTableRow from "./ItemTableRow.vue";

const props = withDefaults(defineProps<ItemTableProps>(), {
    _components: () => {
        return {
            itemTableRow: ItemTableRow,
        }
    }
});
const term = props.term as PrezFocusNode;

// const fieldNames = Object.keys(term.properties || {});

// const fields = computed(()=>
//     [...(props.fields || []).filter(f => fieldNames.includes(f.node.value)).map(f=>f.node.value),    // add fields that are in the list
//     ...fieldNames.filter(fname => !(props.fields || []).find(f=>f.node.value == fname))              // add the rest of the fields that are not in the list
//     ].filter(f=>f in (term.properties || {})).map(f=>term.properties![f] as PrezProperty)
// );

</script>

<template>
    <!-- ItemTable -->
    <Table v-if="term?.properties">
        <TableBody role="rowgroup">
            <component :is="props._components.itemTableRow" v-for="(fieldProp, index) in Object.values(term.properties)"
                :key="fieldProp?.predicate.value" 
                :index="index"
                :term="term" 
                :objects="fieldProp ? fieldProp.objects : []" 
                :predicate="fieldProp!.predicate"
                :renderHtml="props.renderHtml"
                :renderMarkdown="props.renderMarkdown"
            />
        </TableBody>
    </Table>
</template>
