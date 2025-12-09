<script lang="ts" setup>
import { computed } from "vue";
import { SYSTEM_PREDICATES } from 'prez-lib';
import { TableCell, TableRow } from '@/components/ui/table';
import { ItemTableRowProps } from "@/types";
import Predicate from "./Predicate.vue";
import Objects from "./Objects.vue";
import { isHtmlDetected, isMarkdownDetected } from "@/utils/helpers";

const props = withDefaults(defineProps<ItemTableRowProps>(), {
    _components: () => {
        return {
            predicate: Predicate,
            objects: Objects,
        }
    }
});

const isFullWidth = computed(()=>
    props.objects.find(o=>o.termType == 'Literal' && 
        (([SYSTEM_PREDICATES.w3Html, SYSTEM_PREDICATES.w3Markdown].includes(o.datatype?.value || '') || ((props.renderMarkdown && isMarkdownDetected(o.value)) || (props.renderHtml && isHtmlDetected(o.value))))))
);
</script>

<template>
    <!-- ItemTableRow -->
    <slot name="row">
        <TableRow class="hover:bg-unset even:bg-muted/50 border-y">
            <slot name="columns">
                <TableCell v-if="isFullWidth" colspan="2" class="whitespace-normal">
                    <div><component :is="props._components.predicate" :predicate="predicate" :objects="objects" :term="term" variant="item-table" /></div>
                    <div class="border-l pl-4 mt-2 ml-2">
                        <component
                            :is="props._components.objects"
                            :predicate="predicate"
                            :objects="objects"
                            :term="term"
                            variant="item-table"
                            :renderHtml="props.renderHtml"
                            :renderMarkdown="props.renderMarkdown"
                        />
                    </div>
                </TableCell>
                <template v-else>
                    <TableCell class="align-top font-bold">
                        <component :is="props._components.predicate" :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
                    </TableCell>
                    <TableCell class="whitespace-normal w-full">
                        <component
                            :is="props._components.objects"
                            :predicate="predicate"
                            :objects="objects"
                            :term="term"
                            variant="item-table"
                            :renderHtml="props.renderHtml"
                            :renderMarkdown="props.renderMarkdown"
                        />
                    </TableCell>
                </template>
            </slot>
        </TableRow>
    </slot>
</template>