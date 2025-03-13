<script lang="ts" setup>
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { SearchResultsProps } from "@/types";
import Node from "./Node.vue";
import Term from "./Term.vue";
import Literal from "./Literal.vue";

const props = withDefaults(defineProps<SearchResultsProps>(), {
    _components: () => {
        return {
            node: Node,
            term: Term,
            literal: Literal,
        }
    }
});
</script>

<template>
    <!-- SearchResults -->
    <Table v-if="props.results.length" class="search-results">
        <TableBody>
            <TableRow v-for="result in props.results.sort((a, b) => b.weight - a.weight)">
                <TableCell>
                    <span class="float-right flex flex-row gap-1">
                        <Badge v-for="type in result.resource.rdfTypes" variant="outline" class="text-xs">
                            <component :is="props._components.node" :term="type" variant="search-results" />
                        </Badge>
                    </span>
                    <b><component :is="props._components.term" :term="result.resource" variant="search-results" /></b>
                    <div v-if="result.resource.description">
                        <component :is="props._components.literal" class="overflow-hidden text-ellipsis line-clamp-3" hide-language
                            :term="result.resource.description" />
                    </div>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
