<script lang="ts" setup>
import { SYSTEM_PREDICATES, treatAsHtml, treatAsMarkdown, type PrezNode, type PrezTerm } from '@/base/lib';

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
const isFullWidth = computed(()=>
    props.objects.find(o=>o.termType == 'Literal' && 
        (([SYSTEM_PREDICATES.w3Html, SYSTEM_PREDICATES.w3Markdown].includes(o.datatype?.value || '') || (treatAsMarkdown(o.value) || treatAsHtml(o.value)))))
);

</script>
<template>
    <!-- ItemTableRow -->
    <slot name="row">
        <tr :class="index % 2 == 1 ? 'p-row-odd' : 'p-row-even'" >
            <slot name="columns">
                <td v-if="isFullWidth" colspan="2">
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