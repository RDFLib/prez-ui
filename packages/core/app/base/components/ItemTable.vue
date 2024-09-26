<script lang="ts" setup>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

interface Props {
    /** optional, fields to display */
    fields?: string[];

    /** parent term or root focus node */
    term: PrezTerm;
}

import { type PrezFocusNode, type PrezTerm } from '@/base/lib';

const props = defineProps<Props>();
const term = props.term as PrezFocusNode;

//const fields = props.fields ? props.fields.filter(field=>term.properties?.[field]).map(field=>term.properties?.[field]) || Object.values(term.properties || {}) : Object.values(term.properties || {});
const fields = Object.values(term.properties || {});

</script>
<template>
    <div v-if="term?.properties">
        <DataTable :value="Object.values(term.properties)" striped-rows>
            <template #default>
                <table class="p-datatable-table">
                    <thead class="p-datatable-thead" role="rowgroup" data-pc-section="thead" style="position: sticky">
                        <tr><th colspan="2" class="p-datatable-header-cell"></th></tr>
                    </thead>
                    <tbody class="p-datatable-tbody" role="rowgroup" data-pc-section="tbody">
                        <ItemTableRow v-for="(fieldProp, index) in fields" 
                            :key="index" 
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
    min-width: 50rem;
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