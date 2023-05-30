<script lang="ts" setup>
import { reactive, watch, ref } from "vue";
import { RouterLink } from "vue-router";

import ItemListSortButton from "@/components/ItemListSortButton.vue";
import type { VocabListItem, listingTableColumn } from "@/types";

const props = defineProps<{
    items: VocabListItem[];
    childName?: string;
    childLink?: string;
}>();

// Each key is a table header.
// If key has the value "true", it is being sorted alphabetically A-Z.
// If key has the value "false", it is being sorted alphabetically Z-A.
// Only one key can have a value of true or false and other keys are null.
const sortState = reactive<{label: boolean | null, description: boolean | null, status: boolean | null, derivationMode: boolean | null}>({
    label: true,
    description: null,
    status: null,
    derivationMode: null
});

const rows = ref(props.items);

const setSortState = (key: listingTableColumn) => {
    const validKeys: listingTableColumn[] = ["label", "description", "status", "derivationMode"];
    
    // Save the current value.
    const currentKeyValue = sortState[key];

    // Set all the values to null.
    for (const validKey of validKeys) {
        sortState[validKey] = null;
    }

    if (typeof currentKeyValue === "boolean") {
        if (currentKeyValue === true) {
            sortState[key] = false;
        } 
        else if (currentKeyValue === false) {
            sortState[key] = true;
        } else {
            sortState[key] = null;
        }
    }
    else {
        sortState[key] = true;
    }
}

watch(sortState, () => {
    const validKeys: listingTableColumn[] = ["label", "description", "status", "derivationMode"];
    const keyToListItem = {
        label: "title",
        description: "description",
        status: "status",
        derivationMode: "derivationMode",
    }
    
    for (const validKey of validKeys) {
        if (sortState[validKey] === true) {
            rows.value = props.items.sort((a: VocabListItem, b: VocabListItem) => {
                const listItemKey = keyToListItem[validKey];
                if (a.hasOwnProperty(listItemKey)) {
                    return (a[listItemKey] as string).localeCompare(b[listItemKey] as string);
                }
                return 0;
            })
        }
        else if (sortState[validKey] === false) {
            rows.value = props.items.sort((a: VocabListItem, b: VocabListItem) => {
                const listItemKey = keyToListItem[validKey];
                if (b.hasOwnProperty(listItemKey)) {
                    return (b[listItemKey] as string).localeCompare(a[listItemKey] as string);
                }
                return 0;
            })
        }
    }
});

</script>

<template>
    <table class="table" role="grid">
        <thead>
            <tr role="row">
                <th>Label <ItemListSortButton id="label" :state="sortState.label" @clicked="(id) => setSortState(id)" /></th>
                <th>Description <ItemListSortButton id="description" :state="sortState.description" @clicked="(id) => setSortState(id)" /></th>
                <th>Status <ItemListSortButton id="status" :state="sortState.status" @clicked="(id) => setSortState(id)" /></th>
                <th>Derivation mode <ItemListSortButton id="derivationMode" :state="sortState.derivationMode" @clicked="(id) => setSortState(id)" /></th>
            </tr>
        </thead>
        <tbody>
            <tr class="row" role="row" v-for="item in props.items">
                <td>
                    <RouterLink :to="!!item.link ? item.link : ''">
                        {{ item.title || item.iri }}
                    </RouterLink>
                </td>
                <td>
                    <div v-if="!!item.description">{{ item.description.substring(0, 80) + "..." }}</div>
                </td>
                <td>
                    <div v-if="!!item.status">
                        <a :href="item.status.iri" target="_blank">{{ item.status.label }}</a> <span :style="`color: ${item.status.color}`" class="fa-solid fa-circle fa-2xs"></span>
                    </div>
                </td>
                <td>
                    <div v-if="!!item.derivationMode">
                        <a :href="item.derivationMode.iri">{{  item.derivationMode.label }}</a>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.table {
    border-collapse: separate;
    border-spacing: 0 1em;
}

.row {
    padding: 5px;
    background-color: var(--cardBg);
}

th {
    text-align: left;
    padding-left: 0.5rem;
}

td {
    padding: 10px;
}

.list {
    gap: 12px;
    margin-bottom: 12px;

    a.list-item {
        gap: 10px;
        background-color: var(--cardBg);
        padding: 10px;
        border-radius: $borderRadius;

        .list-item-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;

            .list-item-title {
                margin: 0;
            }

            .list-item-desc {
                font-style: italic;
                color: grey;
                font-size: 0.8rem;
            }
        }

        .child-btn {
            align-self: baseline;
            flex-shrink: 0;
        }
    }
}
</style>