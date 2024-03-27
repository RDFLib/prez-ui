<script lang="ts" setup>
import Menubar from "primevue/menubar";
import type { NavItemProps } from "../types";

const props = defineProps<{
    items: NavItemProps[];
}>();
</script>

<template>
    <Menubar :model="props.items" />
</template>

<style lang="scss" scoped>

</style>