<script lang="ts" setup>
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ItemListProps } from "@/types";
import Predicate from "./Predicate.vue";
import Node from "./Node.vue";
import Objects from "./Objects.vue";

const props = withDefaults(defineProps<ItemListProps>(), {
    _components: () => {
        return {
            predicate: Predicate,
            node: Node,
            objects: Objects,
        }
    }
});
const list = props.list;
</script>

<template>
    <!-- ItemList -->
    <div v-if="list">
        <Table style="min-width: 50rem">
            <TableHeader>
                <TableRow>
                    <TableHead><b>Item</b></TableHead>
                    <template v-if="fields">
                        <TableHead v-for="col in fields">
                            <b><component :is="props._components.predicate" :predicate="col.node" :objects="[]" /></b>
                        </TableHead>
                    </template>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="item in list" class="hover:bg-unset odd:bg-muted/50">
                    <TableCell>
                        <component :is="props._components.node" :term="item" variant="item-list" />
                    </TableCell>
                    <template v-if="fields">
                        <TableCell v-for="col in fields">
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
    </div>
</template>
