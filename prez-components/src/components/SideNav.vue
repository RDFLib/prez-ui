<script lang="ts" setup>
import { ref } from "vue";
import Sidebar from "primevue/sidebar";
import Button from "primevue/button";
import { NavItemProps } from "../types";
import SideNavContent from "./SideNavContent.vue";

const props = defineProps<{
    items: NavItemProps[];
}>();

const visible = ref(false);
</script>

<template>
    <Sidebar v-model:visible="visible" header="Prez" class="sidenav sidenav-mobile">
        <SideNavContent v-bind="props" />
    </Sidebar>
    <Button class="sidenav-mobile" icon="pi pi-bars" @click="visible = true" />
    <div class="sidenav sidenav-desktop">
        <SideNavContent v-bind="props" />
    </div>
</template>

<style lang="scss" scoped>
.sidenav {
    display: flex;
    flex-direction: column;
    width: 260px;
}

.sidenav-desktop {
    background-color: #374151;
    height: 100%;
}

.sidenav-mobile {
    display: none;
}

@media screen and (max-width: 576px) {
    .sidenav-mobile {
        display: flex;
        align-self: baseline;
    }

    .sidenav-desktop {
        display: none;
    }
}
</style>