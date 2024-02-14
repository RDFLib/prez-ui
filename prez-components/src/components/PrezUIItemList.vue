<script lang="ts" setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import DataView from "primevue/dataview";
import Button from "primevue/button";
import type { PrezNode, PrezLiteral, PrezItem } from "prez-lib"
import { PrezUIItemListProps } from "../types";
import { sortLiterals, sortNodes } from "../util/helpers";
import PrezUINode from "./PrezUINode.vue";
import PrezUITerm from "./PrezUITerm.vue";

const props = defineProps<PrezUIItemListProps>();

const sortField = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const sortedItems = ref<PrezItem[]>(props.items);

// get the list of predicates that exist in item properties
const predicates = computed<PrezNode[]>(() => {
    const list = props.items.map(item => Object.values(item.properties).map(prop => prop.predicate));
    return Array.from(new Set(list.flat()));
});

function handleSortClick(field: string) {
    if (sortField.value === field) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        sortField.value = field;
        sortOrder.value = "asc";
    }

    if (sortField.value === "label") {
        sortedItems.value = props.items.sort((a, b) => sortNodes(a.focusNode, b.focusNode, sortOrder.value));
    } else {
        sortedItems.value = props.items.sort((a, b) => sortByTerm(a, b, sortField.value, sortOrder.value));
    }
}

// sort terms by first object in objects list
function sortByTerm(a: PrezItem, b: PrezItem, predicateIri: string, direction: "asc" | "desc" = "asc"): number {
    if (a.properties[predicateIri] && b.properties[predicateIri]) {
        const aFirstObj = a.properties[predicateIri].objects[0];
        const bFirstObj = b.properties[predicateIri].objects[0];

        // assume all objects of the same predicate are EITHER a literal or a node - a predicate's range is consistent
        return aFirstObj.termType === "Literal"
            ? sortLiterals(aFirstObj as PrezLiteral, bFirstObj as PrezLiteral, direction)
            : sortNodes(aFirstObj as PrezNode, bFirstObj as PrezNode, direction);
    } else if (a.properties[predicateIri]) {
        return direction === "asc" ? -1 : 1;
    } else if (b.properties[predicateIri]) {
        return direction === "asc" ? 1 : -1;
    } else {
        return 0;
    }
}
</script>

<template>
    <DataView :value="sortedItems" dataKey="value">
        <template #list="slotProps">
            <table>
                <tr>
                    <th class="label">
                        Label
                        <Button :icon="`pi pi-sort-alpha-${sortField === 'label' && sortOrder === 'desc' ? 'up' : 'down'}`" @click="handleSortClick('label')" :outlined="sortField !== 'label'" />
                    </th>
                    <th v-for="predicate in predicates">
                        <PrezUINode v-bind="predicate" />
                        <Button :icon="`pi pi-sort-alpha-${sortField === predicate.value && sortOrder === 'desc' ? 'up' : 'down'}`" @click="handleSortClick(predicate.value)" :outlined="sortField !== predicate.value" />
                    </th>
                    <th></th>
                </tr>
                <template v-for="item in (slotProps.items as PrezItem[])">
                    <tr>
                        <td class="label"><PrezUINode v-bind="item.focusNode" /></td>
                        <td v-for="predicate in predicates">
                            <template v-if="predicate.value in item.properties">
                                <PrezUITerm v-for="obj in item.properties[predicate.value].objects" v-bind="obj" />
                            </template>
                        </td>
                        <td v-if="item.focusNode.members">
                            <RouterLink v-for="member in item.focusNode.members" :to="member.link">
                                <Button size="small" outlined>{{ member.label }}</Button>
                            </RouterLink>
                        </td>
                    </tr>
                    <tr>
                        <td class="desc" :colspan="predicates.length + 2">{{ item.focusNode.description?.value }} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident alias sed temporibus, eum explicabo aut accusamus nam eos doloremque. Atque eligendi illo similique! Unde eum iusto earum quasi reiciendis placeat.</td>
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