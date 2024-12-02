<script lang="ts" setup>
import { SYSTEM_PREDICATES } from 'prez-lib';
import { TableCell, TableRow } from '@/components/ui/table';
import { ItemTableRowProps } from "@/types";
import Predicate from "./Predicate.vue";
import Objects from "./Objects.vue";

const props = withDefaults(defineProps<ItemTableRowProps>(), {
    _components: () => {
        return {
            predicate: Predicate,
            objects: Objects,
        }
    }
});
</script>

<template>
    <!-- ItemTableRow -->
    <slot name="row">
        <TableRow class="hover:bg-unset even:bg-muted/50 border-y">
            <slot name="columns">
                <TableCell v-if="objects.find(o => o.termType == 'Literal' && o.datatype?.value == SYSTEM_PREDICATES.w3Html)" colspan="2">
                    <div><component :is="props._components.predicate" :predicate="predicate" :objects="objects" :term="term" variant="item-table" /></div>
                    <div class="border-l pl-4 mt-2 ml-2">
                        <component :is="props._components.objects" :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
                    </div>
                </TableCell>
                <template v-else>
                    <TableCell class="w-[1%] whitespace-nowrap">
                        <component :is="props._components.predicate" :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
                    </TableCell>
                    <TableCell class="w-[100%]">
                        <component :is="props._components.objects" :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
                    </TableCell>
                </template>
            </slot>
        </TableRow>
    </slot>
</template>