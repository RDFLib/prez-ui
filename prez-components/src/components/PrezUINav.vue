<script lang="ts" setup>
import { NavItemProps } from "../types";
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
        label: "CatPrez",
        route: "/c",
        items: [
            {
                label: "Catalogs",
                route: "/c/catalogs",
            },
            // {
            //     label: "Profiles",
            //     route: "/c/profiles",
            // },
            // {
            //     label: "About",
            //     route: "/c/about",
            // },
        ]
    },
    {
        label: "SpacePrez",
        route: "/s",
        items: [
            {
                label: "Datasets",
                route: "/s/datasets",
            },
            // {
            //     label: "Conformance",
            //     route: "/s/conformance",
            // },
            // {
            //     label: "Profiles",
            //     route: "/s/profiles",
            // },
            // {
            //     label: "About",
            //     route: "/s/about",
            // },
        ]
    },
    {
        label: "VocPrez",
        route: "/v",
        items: [
            {
                label: "Vocabularies",
                route: "/v/vocab",
            },
            {
                label: "Collections",
                route: "/v/collection",
            },
            // {
            //     label: "Profiles",
            //     route: "/v/profiles",
            // },
            // {
            //     label: "About",
            //     route: "/v/about",
            // },
        ]
    },
    // {
    //     label: "Search",
    //     route: "/search"
    // },
    // {
    //     label: "SPARQL",
    //     route: "/sparql"
    // },
    // {
    //     label: "Profile",
    //     route: "/profiles"
    // },
    // {
    //     label: "About",
    //     route: "/about"
    // },
    // {
    //     label: "API Documentation",
    //     route: "/docs"
    // },
];
</script>

<template>
    <SideNav v-if="props.sidenav" :items="items" />
    <TopNav v-else :items="items" />
</template>

<style lang="scss" scoped>

</style>