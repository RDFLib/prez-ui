<script lang="ts" setup>
import type { PrezLiteral, PrezNode, PrezTerm } from '@/base/lib';

interface Props {
    term: PrezTerm;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
}

const props = defineProps<Props>();

</script>
<template>
    <!-- Term -->
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

    <div v-else-if="props.term.termType == 'BlankNode' && props.term.list">
        <NodeList :list="props.term.list" />
    </div>

    <ItemTable
        v-else-if="props.term.termType == 'BlankNode' && props.variant == 'item-table'" 
        :variant="props.variant"
        :term="term"
    />

    <div v-else-if="props.term.termType == 'BlankNode' && props.variant == 'item-list'">
        <TermList :term="props.term" />
    </div>

</template>