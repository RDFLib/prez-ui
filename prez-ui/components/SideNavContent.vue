<script lang="ts" setup>
import { NavItemProps } from "../types";
import SideNavItem from "./SideNavItem.vue";

const props = defineProps<{
    items: NavItemProps[];
}>();
</script>

<template>
    <SideNavItem v-for="item in props.items" v-bind="item" />
</template>

<style lang="scss" scoped>

</style>