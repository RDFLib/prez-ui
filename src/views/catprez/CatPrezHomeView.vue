<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "CatPrez | Prez";
    ui.pageHeading = { name: "CatPrez", url: "/c"};
    ui.breadcrumbs = [{ name: "CatPrez", url: "/c" }];
});
</script>

<template>
    <h1>CatPrez Home</h1>
    <p>Welcome to CatPrez</p>
    <AdvancedSearch flavour="CatPrez" fullPage />
</template>

<style lang="scss" scoped>

</style>