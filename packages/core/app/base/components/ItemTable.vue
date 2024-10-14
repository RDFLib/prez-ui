<script lang="ts" setup>
import DataTable from 'primevue/datatable';

interface Props {
    /** optional, fields in order to display */
    fields?: string[];

    /** parent term or root focus node */
    term: PrezTerm;
}

import { type PrezFocusNode, type PrezProperty, type PrezTerm } from '@/base/lib';

const props = defineProps<Props>();
const term = props.term as PrezFocusNode;

const fieldNames = Object.keys(term.properties || {});

const fields = computed(()=>
    [...(props.fields || []).filter(f => fieldNames.includes(f)),    // add fields that are in the list
    ...fieldNames.filter(f => !((props.fields || []).includes(f)))   // add the rest of the fields that are not in the list
    ].map(f=>term.properties![f] as PrezProperty)
);

// const fields = Object.values(term.properties || {})

</script>
<template>
    <div v-if="term?.properties">
        <DataTable :value="fields" striped-rows>
            <template #default>
                <table class="p-datatable-table">
                    <thead class="p-datatable-thead" role="rowgroup" data-pc-section="thead" style="position: sticky">
                        <tr><th colspan="2" class="p-datatable-header-cell"></th></tr>
                    </thead>
                    <tbody class="p-datatable-tbody" role="rowgroup" data-pc-section="tbody">
                        <ItemTableRow v-for="(fieldProp, index) in fields"
                            :key="fieldProp?.predicate.value" 
                            :index="index"
                            :term="term" 
                            :objects="fieldProp ? fieldProp.objects : []" 
                            :predicate="fieldProp!.predicate" 
                        />
                    </tbody>
                </table>
            </template>
        </DataTable>
    </div>
</template>
<style lang="scss">
.p-datatable-table {
    max-width: 100%;
}
/* nested tables styling */
.p-datatable-table .p-datatable-table {
    min-width: auto;
}
.p-datatable-table .p-datatable-table .p-datatable-thead {
    display:none;
}
</style>