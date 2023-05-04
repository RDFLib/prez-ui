<script lang="ts" setup>
import { reactive, watch, ref } from "vue";
import { RouterLink } from "vue-router";

import ItemListSortButton from "@/components/ItemListSortButton.vue";
import type { ListItem, listingTableColumn } from "@/types";

const props = defineProps<{
    items: ListItem[];
    childName?: string;
    childLink?: string;
}>();

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

// props.items.sort((a, b) => a.status?.localeCompare(b.status))

watch(sortState, (newSortState, oldSortState) => {
    const validKeys: listingTableColumn[] = ["label", "description", "status", "derivationMode"];
    

    for (const validKey of validKeys) {
        if (validKey === "label" && sortState[validKey] === true) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (a.hasOwnProperty("title")) {
                    return a.title.localeCompare(b.title)
                }
            })
        }
        else if (validKey === "label" && sortState[validKey] === false) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (b.hasOwnProperty("title")) {
                    return b.title.localeCompare(a.title)
                }
            })
        }

        else if (validKey === "description" && sortState[validKey] === true) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (a.hasOwnProperty("description")) {
                    return a.description.localeCompare(b.description)
                }
            })
        }
        else if (validKey === "description" && sortState[validKey] === false) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (b.hasOwnProperty("description")) {
                    return b.description.localeCompare(a.description)
                }
            })
        }

        else if (validKey === "status" && sortState[validKey] === true) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (a.hasOwnProperty("status")) {
                    return a.status.localeCompare(b.status)
                }
            })
        }
        else if (validKey === "status" && sortState[validKey] === false) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (b.hasOwnProperty("status")) {
                    return b.status.localeCompare(a.status)
                }
            })
        }

        else if (validKey === "derivationMode" && sortState[validKey] === true) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (a.hasOwnProperty("derivationMode")) {
                    return a.derivationMode.localeCompare(b.derivationMode)
                }
            })
        }
        else if (validKey === "derivationMode" && sortState[validKey] === false) {
            rows.value = props.items.sort((a: ListItem, b: ListItem) => {
                if (b.hasOwnProperty("derivationMode")) {
                    return b.derivationMode.localeCompare(a.derivationMode)
                }
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
                    <div v-if="!!item.status">{{  item.status }}</div>
                </td>
                <td>
                    <div v-if="!!item.derivationMode">{{  item.derivationMode }}</div>
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

td {
    padding: 10px;
}

.list {
    // display: flex;
    // flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;

    a.list-item {
        // display: flex;
        // flex-direction: row;
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