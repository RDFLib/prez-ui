<script lang="ts" setup>
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { NavItemProps } from "../types";

const route = useRoute();

const props = defineProps<NavItemProps>();

const open = ref(route.path === props.route || route.path.startsWith(`${props.route}/`));

function toggleopen() {
    open.value = !open.value;
}
</script>

<template>
    <div class="nav-item" @click="props.route ? undefined : toggleopen()">
        <component :is="props.route ? RouterLink : 'span'" class="link-label" :to="props.route || undefined">{{ props.label }}</component>
        <span v-if="props.items" class="children-dropdown" @click="props.route ? toggleopen() : undefined">
            <i :class="`pi pi-chevron-${open ? 'up' : 'down'}`"></i>
        </span>
    </div>
    <template v-if="props.items">
        <!-- <Transition> -->
            <div v-show="open" class="children-items">
                <SideNavItem v-for="item in props.items" v-bind="item" />
            </div>
        <!-- </Transition> -->
    </template>
</template>

<style lang="scss" scoped>
$padding: 8px;

.nav-item {
    display: flex;
    flex-direction: row;
    align-items: center;

    .link-label {
        padding: $padding;
        flex-grow: 1;
    }

    .children-dropdown {
        padding: $padding;
        cursor: pointer;
    }
}
.children-items {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: $padding;
}
</style>