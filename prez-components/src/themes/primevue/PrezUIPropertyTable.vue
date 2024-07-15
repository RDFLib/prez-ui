<script lang="ts" setup>
import type { PrezUIPropertyTableProps } from '@/types';
import DataTable from 'primevue/datatable';
import Column from "primevue/column";
import PrezUIDebug from '@/components/PrezUIDebug.vue';

const props = defineProps<PrezUIPropertyTableProps>();
</script>
<template>
    <PrezUIDebug title="PrezUIPropertyTable">
        <DataTable stripedRows :value="Object.keys(props.properties)" tableStyle="min-width: 50rem">
            <Column v-for="col of [{field: 'predicate', header: 'Predicate', style: 'width: 1%;white-space:nowrap;'}, {field: 'objects', header: 'Objects', style: ''}]" body="" :style="col.style" v-bind="col" v-bind:key="col.field">
                <template #body="slotProps">
                    <PrezUINode v-if="col.field == 'predicate'" :term="props.properties[slotProps.data].predicate"></PrezUINode>
                    <PrezUITerm
                        v-if="col.field == 'objects'"
                        :debug="props.debug" 
                        v-for="obj of props.properties[slotProps.data].objects" 
                        :term="obj" :key="obj">
                    </PrezUITerm>
                </template>                    
            </Column>
        </DataTable>
    </PrezUIDebug>
</template>
