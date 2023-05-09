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
    <div class="list">
        <RouterLink class="list-item" v-for="item in props.items" :to="!!item.link ? item.link : ''">
            <div class="list-item-left">
                <h4 class="list-item-title">{{ item.title || item.iri }}</h4>
                <div v-if="!!item.description" class="list-item-desc">{{ item.description }}</div>
            </div>
            <RouterLink v-if="props.childLink" @click.stop :to="item.link + props.childLink" class="btn outline sm child-btn">{{ props.childName }}</RouterLink>
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;;

    a.list-item {
        display: flex;
        flex-direction: row;
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