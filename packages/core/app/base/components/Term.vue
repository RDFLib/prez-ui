<script lang="ts" setup>
import type { PrezLiteral, PrezNode, PrezTerm } from '../lib';

interface Props {
    term: PrezTerm;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
}

const props = defineProps<Props>();

</script>
<template>
    <Literal 
        v-if="props.term.termType == 'Literal'" 
        :term="props.term as PrezLiteral"
        :variant="props.variant"
    />

    <Node 
        v-else-if="props.term.termType == 'NamedNode'" 
        :term="props.term as PrezNode"
        :variant="props.variant"
    />

    <ItemTable
        v-else-if="props.term.termType == 'BlankNode'" 
        v-bind="props" 
    />

</template>