<script lang="ts" setup>
import type { TermProps } from '../types';
const props = defineProps<TermProps>();

</script>
<template>
    <Literal 
        v-if="props.term.termType=='Literal'" 
        v-bind="props" 
    />

    <Node 
        v-else-if="props.term.termType=='NamedNode'" 
        v-bind="props"
    />

    <ItemTable
        v-else-if="props.term.termType == 'BlankNode'" 
        v-bind="props" 
    />
    
</template>