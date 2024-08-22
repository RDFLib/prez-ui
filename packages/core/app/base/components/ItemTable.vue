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

    <!-- <DataView :value="Object.values(term.properties)">
        <template #default="items">
            <tr v-for="p of items">
                <th>{{ p.predicate }}</th>
                <td>value</td>
            </tr>
        </template>
    </DataView> -->

        <DataTable striped-rows :value="Object.values(term.properties)">
            <Column :style="'width: 1%;white-space:nowrap;'" field="predicate" >
                <template #body="{ data: {predicate, objects} }">
                    <Predicate :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
                </template>
            </Column>
            <Column field="objects" >
                <template #body="{ data: {predicate, objects} }">
                    <Objects :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
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