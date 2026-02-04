<script lang="ts" setup>
import { computed } from "vue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ItemListProps } from "@/types";
import Predicate from "./Predicate.vue";
import Node from "./Node.vue";
import Objects from "./Objects.vue";
import {PrezFocusNode, PrezNode, sortNodesByLabel} from "prez-lib";
import {Button} from "@/components/ui/button";
import { ArrowUpDown, ArrowDownAZ, ArrowUpAZ, List } from "lucide-vue-next";

const props = withDefaults(defineProps<ItemListProps>(), {
	showMembersButton: true,
    _components: () => {
        return {
            predicate: Predicate,
            node: Node,
            objects: Objects,
        }
    }
});

const sortBy = defineModel<string>("sortBy", {default: "label"});
const sortDirection = defineModel<"ASC"|"DESC">("sortDirection", {default: "ASC"});

const sortedList = computed(() => {
	let sorted: PrezFocusNode[];
	if (sortBy.value === "label") {
		sorted = props.list.toSorted(sortNodesByLabel);
	} else {
		sorted = props.list.toSorted((a, b) => {
			if (a.properties && sortBy.value in a.properties && b.properties && sortBy.value in b.properties) {
				if (a.properties[sortBy.value].objects.every(o => o.termType === "NamedNode") && b.properties[sortBy.value].objects.every(o => o.termType === "NamedNode")) {
					(a.properties[sortBy.value].objects as PrezNode[]).sort(sortNodesByLabel);
					(b.properties[sortBy.value].objects as PrezNode[]).sort(sortNodesByLabel);
					return sortNodesByLabel(a.properties[sortBy.value].objects[0] as PrezNode, b.properties[sortBy.value].objects[0] as PrezNode);
				} else {
					a.properties[sortBy.value].objects.sort((ao, bo) => ao.value.localeCompare(bo.value));
					b.properties[sortBy.value].objects.sort((ao, bo) => ao.value.localeCompare(bo.value));
					return a.properties[sortBy.value].objects[0].value.localeCompare(b.properties[sortBy.value].objects[0].value);
				}
			} else if (a.properties && sortBy.value in a.properties) {
				return -1;
			} else if (b.properties && sortBy.value in b.properties) {
				return 1;
			} else {
				return a.value.localeCompare(b.value);
			}
		});
	}
	if (sortDirection.value === "DESC") {
		sorted.reverse();
	}
	return sorted;
});

function toggleSort(predicate: string) {
	if (predicate === sortBy.value) {
		sortDirection.value = sortDirection.value === "ASC" ? "DESC" : "ASC";
	} else {
		sortBy.value = predicate;
		sortDirection.value = "ASC";
	}
}
</script>

<template>
    <!-- ItemList -->
    <Table v-if="props.list" class="item-list">
        <TableHeader>
            <TableRow class="hover:bg-unset">
                <TableHead>
	                <div class="flex flex-row items-center gap-2">
		                <span class="font-bold">Item</span>
		                <Button :variant="sortBy === 'label' ? 'secondary' : 'ghost'" size="icon" @click="toggleSort('label')">
			                <template v-if="sortBy === 'label'">
				                <ArrowDownAZ v-if="sortDirection === 'ASC'" class="size-4" />
				                <ArrowUpAZ v-else class="size-4" />
			                </template>
			                <ArrowUpDown v-else class="size-4" />
		                </Button>
	                </div>
                </TableHead>
                <template v-if="fields">
                    <TableHead v-for="col in fields">
	                    <div class="flex flex-row items-center gap-2">
		                    <span class="font-bold"><component :is="props._components.predicate" :predicate="col.node" :objects="[]" /></span>
		                    <Button :variant="sortBy === col.node.value ? 'secondary' : 'ghost'" size="icon" @click="toggleSort(col.node.value)">
			                    <template v-if="sortBy === col.node.value">
				                    <ArrowDownAZ v-if="sortDirection === 'ASC'" class="size-4" />
				                    <ArrowUpAZ v-else class="size-4" />
			                    </template>
			                    <ArrowUpDown v-else class="size-4" />
		                    </Button>
	                    </div>
                    </TableHead>
                </template>
	            <TableHead v-if="props.showMembersButton && props.list.some(i => i.members !== undefined)"></TableHead>
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
	            <TableCell v-if="props.showMembersButton && props.list.some(i => i.members !== undefined)">
		            <Button v-if="item.members" variant="outline" class="float-right max-md:size-9" asChild>
			            <RouterLink :to="item.members.value">
				            <span class="max-md:hidden">Members</span>
				            <List class="size-4 md:hidden" />
			            </RouterLink>
		            </Button>
	            </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
