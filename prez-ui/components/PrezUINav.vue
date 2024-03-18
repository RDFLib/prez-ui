<script lang="ts" setup>
import type { NavItemProps } from "../types";
import SideNav from "./SideNav.vue";
import TopNav from "./TopNav.vue";

const props = withDefaults(defineProps<{
    sidenav: boolean;
}>(), {
    sidenav: true
});

const items: NavItemProps[] = [
    {
        label: "Home",
        route: "/"
    },
    {
        label: "Catalogs",
        route: "/catalogs"
    }
];
</script>

<template>
    <SideNav v-if="props.sidenav" :items="items" />
    <TopNav v-else :items="items" />
</template>

<style lang="scss" scoped>

</style>