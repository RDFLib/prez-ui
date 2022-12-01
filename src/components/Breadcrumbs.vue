<script setup>
import { RouterLink } from "vue-router";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();
</script>

<template>
    <div id="breadcrumbs">
        <RouterLink to="/" class="breadcrumb">Home</RouterLink>
        <span v-if="ui.breadcrumbs.length > 0" class="breadcrumb-separator"><i class="fa-regular fa-chevron-right"></i></span>
        <template v-for="(breadcrumb, index) in ui.breadcrumbs">
            <RouterLink :to="breadcrumb.url" class="breadcrumb">{{ breadcrumb.name }}</RouterLink>
            <span v-if="index < ui.breadcrumbs.length - 1" class="breadcrumb-separator"><i class="fa-regular fa-chevron-right"></i></span>
        </template>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

#breadcrumbs {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    a.breadcrumb {
        font-size: 0.8em;
        color: $headerColor;
    }

    .breadcrumb-separator {
        font-size: 0.66em;
    }
}
</style>