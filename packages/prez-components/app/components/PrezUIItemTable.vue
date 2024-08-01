<script lang="ts" setup>
import type { PrezUIItemTableProps } from '../types';
import DataTable from 'primevue/datatable';
import Column from "primevue/column";
import type { PrezFocusNode } from 'prez-lib';
import PrezUINode from './PrezUINode.vue';
import PrezUITerm from './PrezUITerm.vue';

const props = defineProps<PrezUIItemTableProps>();
const term = props.term as PrezFocusNode;
</script>
<template>
    <DataTable v-if="term?.properties" striped-rows :value="Object.keys(term.properties)" table-style="min-width: 50rem">
        <template #body="slotProps">
            <slot name="widget-row" :property="term.properties[slotProps.data]" />
        </template>
        <Column 
            v-for="col of [{field: 'predicate', header: 'Predicate', style: 'width: 1%;white-space:nowrap;'}, {field: 'objects', header: 'Objects', style: ''}]"
            :key="col.field" body="" :style="col.style" v-bind="col" >
            <template #body="slotProps">
                <slot v-if="col.field == 'predicate'" name="widget-predicate" :property="term.properties[slotProps.data]">
                    <PrezUINode
                        :term="term.properties[slotProps.data]!.predicate"
                    />
                </slot>
                <slot v-if="col.field == 'objects'" name="widget-objects" :property="term.properties[slotProps.data]">
                    <PrezUITerm
                        v-for="(obj, index) of term.properties[slotProps.data]!.objects" 
                        :key="index" :term="obj"
                    />
                    
                </slot>
            </template>                    
        </Column>
    </DataTable>
</template>
