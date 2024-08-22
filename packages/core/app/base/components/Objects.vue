<script lang="ts" setup>
import { type PrezNode, type PrezTerm } from '@/base/lib';

interface Props {
    /** parent term or root focus node */
    term: PrezTerm;
    /** the associated predicate for these objects that are being rendered */
    predicate: PrezNode;
    /** the main set of objects being rendered */
    objects: PrezTerm[];
    /** tells you the context these objects are being rendered in */
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
}
const props = defineProps<Props>();

</script>
<template>
    <slot>
        <div v-for="(obj, index) of props.objects" :key="index" >
            <Term :term="obj" :variant="variant" />
        </div>
    </slot>
</template>
