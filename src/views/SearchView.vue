<script lang="ts" setup>
import { ref, inject, onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import { configKey, defaultConfig } from "@/types";
import CatPrezSearch from "@/components/CatPrezSearch.vue";
import SpacePrezSearch from "@/components/SpacePrezSearch.vue";
import VocPrezSearch from "@/components/VocPrezSearch.vue";

const ui = useUiStore();

const { enabledPrezs } = inject(configKey, defaultConfig);

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Search | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "Search", url: "/search" }];
});
</script>

<template>
    <h1>Search</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non dolore earum, vero corporis saepe iste, minus blanditiis tenetur amet corrupti id perferendis quos nisi est ducimus magnam voluptates repellat delectus!</p>
    <div>
        <input type="search" name="" id="" placeholder="Search...">
        
    </div>
    <div id="search-container">
        <div v-if="enabledPrezs.includes('CatPrez')" class="search-type">
            <h2>Catalogue Search</h2>
            <CatPrezSearch />
        </div>
        <div v-if="enabledPrezs.includes('SpacePrez')" class="search-type">
            <h2>Feature Search</h2>
            <SpacePrezSearch />
        </div>
        <div v-if="enabledPrezs.includes('VocPrez')" class="search-type">
            <h2>Concept Search</h2>
            <VocPrezSearch />
        </div>
    </div>
</template>

<style lang="scss" scoped>
#search-container {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .search-type {
        flex: 1;
    }
}
</style>