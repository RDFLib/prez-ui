<script lang="ts" setup>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

interface Props {
    term: PrezTerm; // parent term or root focus node
}

import { type PrezFocusNode, type PrezTerm } from '@/base/lib';

const props = defineProps<Props>();
const term = props.term as PrezFocusNode;

</script>
<template>
    <div v-if="term?.properties">
        <DataTable striped-rows :value="Object.values(term.properties)">
            <Column
                v-for="col of [{field: 'predicate', style: 'width: 1%;white-space:nowrap;'}, {field: 'objects', style: ''}]"
                :key="col.field" body="" :style="col.style" v-bind="col" >
                <template #body="{ data: {predicate, objects} }">
                    <slot v-if="col.field == 'predicate'" name="predicate" :property="term.properties[predicate.value]">
                        <Predicate :predicate="predicate" :objects="objects" :term="term" />
                    </slot>
                    <slot v-if="col.field == 'objects'" name="objects" :property="term.properties[predicate.value]">
                        <Objects :predicate="predicate" :objects="objects" :term="term" />
                    </slot>
                </template>                    
            </Column>

        </DataTable>
    </div>
</template>
<style lang="scss">
.p-datatable-table {
    min-width: 50rem;
}
/* nested tables styling */
.p-datatable-table .p-datatable-table {
    min-width: auto;
}
.p-datatable-table .p-datatable-table .p-datatable-thead {
    display:none;
}
</style>