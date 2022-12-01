<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
    items: Array
});
</script>

<template>
    <div class="list">
        <RouterLink class="list-item" v-for="item in props.items" :to="!!item.link ? item.link : ''">
            <h4 class="list-item-title">{{ item.title }}</h4>
            <div v-if="!!item.description" class="list-item-desc">{{ item.description }}</div>
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    a.list-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        background-color: $cardBg;
        padding: 10px;

        .list-item-title {
            margin: 0;
        }

        .list-item-desc {
            font-style: italic;
            color: grey;
            font-size: 0.8rem;
        }
    }
}
</style>