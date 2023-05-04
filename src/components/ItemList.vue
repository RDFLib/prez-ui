<script lang="ts" setup>
import { RouterLink } from "vue-router";
import type { ListItem } from "@/types";

const props = defineProps<{
    items: ListItem[];
    childName?: string;
    childLink?: string;
}>();
</script>

<template>
    <table class="table" role="grid">
        <thead>
            <tr role="row">
                <th>Label</th>
                <th>Description</th>
                <th>Status</th>
                <th>Derivation mode</th>
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
                    <div v-if="!!item.role">{{  item.role }}</div>
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