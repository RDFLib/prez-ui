<script lang="ts" setup>
import type { NavItemProps } from "../types";
import SideNav from "./SideNav.vue";
import TopNav from "./TopNav.vue";

const props = withDefaults(defineProps<{
    sidenav?: boolean;
}>(), {
    sidenav: true
});

const items: NavItemProps[] = [
    {
        label: "Home",
        route: "/"
    },
    {
        label: "About",
        route: "/about"
    },
    {
        label: "Catalogs",
        route: "/catalogs"
    },
    {
        label: "Profiles",
        route: "/profiles"
    },
    {
        label: "Search",
        route: "/search"
    },
    {
        label: "SPARQL",
        route: "/sparql"
    },
];
</script>

<template>
    <SideNav v-if="props.sidenav" :items="items" />
    <TopNav v-else :items="items" />
</template>

<style lang="scss" scoped>

</style>