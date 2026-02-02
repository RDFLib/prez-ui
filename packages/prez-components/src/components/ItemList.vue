<script lang="ts" setup>
import { computed } from "vue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ItemListProps } from "@/types";
import Predicate from "./Predicate.vue";
import Node from "./Node.vue";
import Objects from "./Objects.vue";
import {sortNodesByLabel} from "prez-lib";
import {Button} from "@/components/ui/button";
import { ArrowUpDown } from "lucide-vue-next";

const props = withDefaults(defineProps<ItemListProps>(), {
    _components: () => {
        return {
            predicate: Predicate,
            node: Node,
            objects: Objects,
        }
    }
});

const sortBy = defineModel<string>("sortBy", {default: "label"});
// const sortDirection = defineModel<"ASC"|"DESC">("sortDirection", {default: "ASC"});

const sortedList = computed(() => {
	if (sortBy.value === "label") {
		return props.list.sort(sortNodesByLabel);
	}
	return props.list;
});
</script>

<template>
    <!-- ItemList -->
    <Table v-if="props.list" class="item-list">
        <TableHeader>
            <TableRow class="hover:bg-unset">
                <TableHead>
	                <b>Item</b>
	                <Button variant="ghost" size="icon"><ArrowUpDown class="size-4" /></Button>
                </TableHead>
                <template v-if="fields">
                    <TableHead v-for="col in fields">
                        <b><component :is="props._components.predicate" :predicate="col.node" :objects="[]" /></b>
	                    <Button variant="ghost" size="icon"><ArrowUpDown class="size-4" /></Button>
                    </TableHead>
                </template>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="item in sortedList" class="hover:bg-unset odd:bg-muted/50">
                <TableCell class="whitespace-normal">
                    <component :is="props._components.node" :term="item" variant="item-list" />
                </TableCell>
                <template v-if="fields">
                    <TableCell v-for="col in fields" class="whitespace-normal">
                        <component :is="props._components.objects"
                            v-if="item.properties?.[col.node.value]?.objects"
                            :term="col.node"
                            :predicate="col.node"
                            :objects="item.properties[col.node.value]?.objects"
                            variant="item-list"
                        />
                    </TableCell>
                </template>
            </TableRow>
        </TableBody>
    </Table>
</template>
