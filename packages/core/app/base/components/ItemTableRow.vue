<script lang="ts" setup>
import { SYSTEM_PREDICATES, type PrezNode, type PrezTerm } from '@/base/lib';

interface Props {
    /** parent term or root focus node */
    term: PrezTerm;
    /** index of the row */
    index: number; 
    /** the main predicate to render */
    predicate: PrezNode;
    /** objects to render */
    objects: PrezTerm[];
}

const props = defineProps<Props>();
</script>
<template>
    <slot name="row">
        <tr :class="index % 2 == 1 ? 'p-row-odd' : 'p-row-even'" >
            <slot name="columns">
                <td v-if="objects.find(o=>o.termType == 'Literal' && o.datatype?.value == SYSTEM_PREDICATES.w3Html)" colspan="2">
                    <div><Predicate :predicate="predicate" :objects="objects" :term="term" variant="item-table" /></div>
                    <div class="border-l pl-4 mt-2 ml-2"><Objects :predicate="predicate" :objects="objects" :term="term" variant="item-table" /></div>
                </td>
                <template v-else>
                    <td class="w-[1%] whitespace-nowrap">
                        <Predicate :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
                    </td>
                    <td class="w-[100%]">
                        <Objects :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
                    </td>
                </template>
            </slot>
        </tr>
    </slot>
</template>