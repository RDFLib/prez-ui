<script lang="ts" setup>
import { RouterView, RouterLink } from "vue-router";
import Menubar from "primevue/menubar";

const items = [
    {
        label: "Home",
        route: "/"
    },
    {
        label: "Basic",
        route: "/basic"
    },
    {
        label: "List",
        route: "/list"
    },
    {
        label: "Object",
        route: "/object"
    },
    {
        label: "Navigation",
        route: "/nav"
    },
];
</script>

<template>
    <Menubar :model="items">
        <template #item="{ item, props }">
            <RouterLink v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </RouterLink>
        </template>
    </Menubar>
    <RouterView></RouterView>
</template>
