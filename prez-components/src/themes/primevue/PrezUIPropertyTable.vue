<script lang="ts" setup>
import type { PrezUIPropertyTableProps } from '../../types';
import DataTable from 'primevue/datatable';
import Column from "primevue/column";
import PrezUIDebug from '../../components/PrezUIDebug.vue';
import { PrezFocusNode } from 'prez-lib';

const props = defineProps<PrezUIPropertyTableProps>();
const term = props.term as PrezFocusNode;
</script>
<template>
    <PrezUIDebug title="PrezUIPropertyTable">
        <DataTable v-if="term?.properties" stripedRows :value="Object.keys(term.properties)" tableStyle="min-width: 50rem">
            <Column v-for="col of [{field: 'predicate', header: 'Predicate', style: 'width: 1%;white-space:nowrap;'}, {field: 'objects', header: 'Objects', style: ''}]" body="" :style="col.style" v-bind="col" v-bind:key="col.field">
                <template #body="slotProps">
                    <PrezUINode
                        v-if="col.field == 'predicate'"
                        :term="term.properties[slotProps.data].predicate">
                    </PrezUINode>
                    <PrezUITerm
                        v-if="col.field == 'objects'"
                        v-for="(obj, index) of term.properties[slotProps.data].objects" 
                        :term="obj" :key="index">
                    </PrezUITerm>
                </template>                    
            </Column>
        </DataTable>
    </PrezUIDebug>
</template>
