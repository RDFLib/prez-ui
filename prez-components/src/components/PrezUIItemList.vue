<script lang="ts" setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import DataView from "primevue/dataview";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import type { PrezNode, PrezLiteral, PrezItem } from "prez-lib"
import { PrezUIItemListProps } from "../types";
import { HIDDEN_PREDICATES } from "../util/consts";
import { sortLiterals, sortNodes } from "../util/helpers";
import PrezUINode from "./PrezUINode.vue";
import PrezUITerm from "./PrezUITerm.vue";

const props = defineProps<PrezUIItemListProps>();

const sortField = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const sortedItems = ref<PrezItem[]>(props.data || []);

// get the list of predicates that exist in item properties
const predicates = computed<PrezNode[]>(() => {
    if (props.data) {
        const list = props.data.map(item => Object.values(item.properties).map(prop => prop.predicate)).flat(1);
        const iris: string[] = [];
        const p: PrezNode[] = [];
        list.forEach(item => {
            if (!iris.includes(item.value) && !HIDDEN_PREDICATES.includes(item.value)) {
                p.push(item);
                iris.push(item.value);
            }
        });
        return p;
    } else {
        return [];
    }
});

function handleSortClick(field: string) {
    if (props.data) {
        if (sortField.value === field) {
            sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
        } else {
            sortField.value = field;
            sortOrder.value = "asc";
        }

        if (sortField.value === "label") {
            sortedItems.value = props.data.sort((a, b) => sortNodes(a.focusNode, b.focusNode, sortOrder.value));
        } else {
            sortedItems.value = props.data.sort((a, b) => sortByTerm(a, b, sortField.value, sortOrder.value));
        }
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

// to use for rendering when "loading"
const placeholderItems = [
    {
        value: "1",
        properties: {}
    },
    {
        value: "2",
        properties: {}
    },
    {
        value: "3",
        properties: {}
    }
];
</script>

<template>
    <DataView :value="props.loading ? placeholderItems : sortedItems" dataKey="value">
        <template #list="slotProps">
            <table>
                <tr>
                    <th class="label">
                        <Skeleton v-if="props.loading" height="1.5rem" width="6rem" class="mb-2"></Skeleton>
                        <div v-else class="col-header">
                            Label
                            <Button size="small" :icon="`pi pi-sort-alpha-${sortField === 'label' && sortOrder === 'desc' ? 'up' : 'down'}`" @click="handleSortClick('label')" :outlined="sortField !== 'label'" />
                        </div>
                    </th>
                    <th v-for="predicate in predicates">
                        <div class="col-header">
                            <PrezUINode v-bind="predicate" />
                            <Button size="small" :icon="`pi pi-sort-alpha-${sortField === predicate.value && sortOrder === 'desc' ? 'up' : 'down'}`" @click="handleSortClick(predicate.value)" :outlined="sortField !== predicate.value" />
                        </div>
                    </th>
                    <th class="members-col"></th>
                </tr>
                <template v-for="item in slotProps.items">
                    <tr>
                        <td class="label">
                            <Skeleton v-if="props.loading" height="1.5rem" width="14rem" class="mb-2"></Skeleton>
                            <PrezUINode v-else v-bind="item.focusNode" showType :showDesc="false" :showExt="false" />
                        </td>
                        <td v-for="predicate in predicates">
                            <template v-if="predicate.value in item.properties">
                                <PrezUITerm v-for="obj in item.properties[predicate.value].objects" v-bind="obj" />
                            </template>
                        </td>
                        <td v-if="!props.loading && item.focusNode.members" class="members-col">
                            <RouterLink v-for="member in item.focusNode.members" :to="member.link">
                                <Button size="small" outlined>{{ member.label }}</Button>
                            </RouterLink>
                        </td>
                    </tr>
                    <tr>
                        <td class="desc" :colspan="predicates.length + 2">
                            <Skeleton v-if="props.loading" width="32rem" class="mb-2"></Skeleton>
                            <template v-else>{{ item.focusNode.description?.value || "" }}</template>
                        </td>
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
            background-color: #f8fafc;
        }

        th > .col-header {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
            padding: 6px;
        }

        td {
            padding: 8px;

            &.desc {
                font-style: italic;
                font-size: 0.9em;
                color: #b1b1b1;
            }

            &.members-col {
                text-align: right;
            }
        }
    }

    .label {
        min-width: 300px;
    }
}
</style>