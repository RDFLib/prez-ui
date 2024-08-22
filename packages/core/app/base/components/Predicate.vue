<script lang="ts" setup>
import { type PrezNode, type PrezTerm } from '@/base/lib';

interface Props {
    /** parent term or root focus node */
    term: PrezTerm;
    /** the main predicate to render */
    predicate: PrezNode;
    /** when rendering a predicate you may access the associated objects */
    objects: PrezTerm[];
    /** tells you the context this predicate is being rendered in */
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
}
const props = defineProps<Props>();

</script>
<template>
    <slot>
        <Node :term="props.predicate" :variant="props.variant" />
    </slot>
</template>
