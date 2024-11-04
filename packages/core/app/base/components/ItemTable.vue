<script lang="ts" setup>
import { type PrezFocusNode, type PrezProperty, type PrezTerm, type PrezNodeList } from '@/base/lib';

interface Props {
    /** optional, fields in order to display */
    // fields?: PrezNodeList[];

    /** parent term or root focus node */
    term: PrezTerm;
}

const props = defineProps<Props>();
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
    <div v-if="term?.properties">
        <table>
            <thead role="rowgroup" style="position: sticky">
                <tr><th colspan="2"></th></tr>
            </thead>
            <tbody role="rowgroup">
                <ItemTableRow v-for="(fieldProp, index) in Object.values(term.properties)"
                    :key="fieldProp?.predicate.value" 
                    :index="index"
                    :term="term" 
                    :objects="fieldProp ? fieldProp.objects : []" 
                    :predicate="fieldProp!.predicate" 
                />
            </tbody>
        </table>
    </div>
</template>
