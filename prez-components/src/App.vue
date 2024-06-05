<script lang="ts" setup>
import { RouterView, RouterLink } from "vue-router";

const items = [
    {
        label: "Home",
        route: "/"
    },
];
</script>

<template>
    <nav>
        <RouterLink v-for="item in items" :to="item.route">{{ item.label }}</RouterLink>
    </nav>
    <RouterView></RouterView>
</template>
