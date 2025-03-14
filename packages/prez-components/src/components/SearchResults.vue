<script lang="ts" setup>
import { ChevronRight, Info } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { SearchResultsProps } from "@/types";
import Node from "./Node.vue";
import Term from "./Term.vue";
import Literal from "./Literal.vue";
import { PrezFocusNode, PrezLinkParent } from "prez-lib";
import ItemLink from "./ItemLink.vue";

const props = withDefaults(defineProps<SearchResultsProps>(), {
    _components: () => {
        return {
            node: Node,
            term: Term,
            literal: Literal,
            itemLink: ItemLink,
        }
    }
});

function getParent(resource: PrezFocusNode): PrezLinkParent | undefined {
    // TODO: self should not be listed in parents
    return resource.links?.map(l => l.parents?.filter(p => p.label && p.url !== l.value).slice(-1)[0])[0];
}
</script>

<template>
    <!-- SearchResults -->
    <Table v-if="props.results.length" class="search-results">
        <TableBody>
            <TableRow v-for="result in props.results.sort((a, b) => b.weight - a.weight)">
                <TableCell class="flex flex-col gap-1">
                    <div class="flex flex-row items-center gap-2">
                        <template v-for="parent in [getParent(result.resource)]">
                            <span v-if="parent" class="inline-flex flex-row items-center gap-1">
                                <component :is="props._components.itemLink" :to="parent.url" variant="search-results">{{ parent.label?.value }}</component>
                                <ChevronRight class="size-4" />
                            </span>
                        </template>
                        <span class="font-bold mr-auto">
                            <component :is="props._components.term" :term="result.resource" variant="search-results" />
                        </span>
                        <span class="flex flex-row gap-1">
                            <Badge v-for="type in result.resource.rdfTypes" variant="outline" class="text-xs">
                                <component :is="props._components.node" :term="type" variant="search-results" />
                            </Badge>
                        </span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger class="cursor-default">
                                    <span class="text-muted-foreground"><Info class="size-4" /></span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Matched on <component :is="props._components.node" :term="result.predicate" variant="search-results" />
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div v-if="result.resource.description">
                        <component :is="props._components.literal" class="overflow-hidden text-ellipsis line-clamp-3 text-muted-foreground italic text-sm" hide-language :term="result.resource.description" />
                    </div>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
