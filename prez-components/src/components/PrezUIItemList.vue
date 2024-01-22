<script lang="ts" setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import DataView from 'primevue/dataview';
import Button from "primevue/button";
import { ItemExtra, PrezNode, PrezLiteral, PrezUIItemListProps } from "../types";
import { sortLiterals, sortNodes } from "../util/helpers";
import PrezUINode from "./PrezUINode.vue";
import PrezUILiteral from "./PrezUILiteral.vue";

const props = defineProps<PrezUIItemListProps>();

const sortField = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const sortedItems = ref<ItemExtra[]>(props.items);

function handleSortClick(field: string) {
    if (sortField.value === field) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        sortField.value = field;
        sortOrder.value = "asc";
    }

    if (sortField.value === "label") {
        sortedItems.value = props.items.sort((a, b) => sortNodes(a, b, sortOrder.value));
    } else {
        sortedItems.value = props.items.sort((a, b) => sortByExtra(a, b, sortField.value, sortOrder.value));
    }
}

function sortByExtra(a: ItemExtra, b: ItemExtra, predicate: string, direction: "asc" | "desc" = "asc"): number {
    if (a.extras?.[predicate] && b.extras?.[predicate]) {
        return a.extras?.[predicate].rdfType === "literal"
            ? sortLiterals(a.extras[predicate] as PrezLiteral, b.extras[predicate] as PrezLiteral, direction)
            : sortNodes(a.extras[predicate] as PrezNode, b.extras[predicate] as PrezNode, direction);
    } else if (a.extras?.[predicate]) {
        return direction === "asc" ? -1 : 1;
    } else if (b.extras?.[predicate]) {
        return direction === "asc" ? 1 : -1;
    } else {
        return 0;
    }
}
</script>

<template>
    <DataView :value="sortedItems" dataKey="iri">
        <template #list="slotProps">
            <table>
                <tr>
                    <th class="label">
                        Label
                        <Button :icon="`pi pi-sort-alpha-${sortField === 'label' && sortOrder === 'desc' ? 'up' : 'down'}`" @click="handleSortClick('label')" :outlined="sortField !== 'label'" />
                    </th>
                    <th v-for="predicate in props.predicates">
                        <PrezUINode v-bind="predicate" />
                        <Button :icon="`pi pi-sort-alpha-${sortField === predicate.iri && sortOrder === 'desc' ? 'up' : 'down'}`" @click="handleSortClick(predicate.iri)" :outlined="sortField !== predicate.iri" />
                    </th>
                    <th v-if="props.childButton"></th>
                </tr>
                <template v-for="item in slotProps.items">
                    <tr>
                        <td class="label">
                            <RouterLink :to="item.links[0]">{{ item.label?.value }}</RouterLink>
                        </td>
                        <td v-for="predicate in props.predicates">
                            <template v-if="item.extras && item.extras[predicate.iri]">
                                <PrezUINode v-if="item.extras[predicate.iri].rdfType === 'node'" v-bind="item.extras[predicate.iri]" showProv showType />
                                <PrezUILiteral v-else-if="item.extras[predicate.iri].rdfType === 'literal'" v-bind="item.extras[predicate.iri]" />
                            </template>
                            
                        </td>
                        <td v-if="childButton">
                            <RouterLink :to="item.links[0] + props.childButton?.suffix">
                                <Button size="small" outlined>{{ props.childButton?.label }}</Button>
                            </RouterLink>
                        </td>
                    </tr>
                    <tr>
                        <td class="desc" colspan="5">{{ item.description?.value }} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident alias sed temporibus, eum explicabo aut accusamus nam eos doloremque. Atque eligendi illo similique! Unde eum iusto earum quasi reiciendis placeat.</td>
                    </tr>
                </template>
            </table>
        </template>
    </DataView>
</template>

<style lang="scss" scoped>
table {
    border-collapse: collapse;
    width: 100%;

    th {
        
    }

    & > tr {
        &:nth-child(4n - 2), &:nth-child(4n - 1) {
            background-color: #1c2532;
        }

        td {
            padding: 8px;

            &.desc {
                font-style: italic;
                font-size: 0.9em;
                color: #b1b1b1;
            }
        }
    }

    .label {
        min-width: 300px;
    }
}
</style>