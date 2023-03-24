<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "VocPrez | Prez";
    ui.pageHeading = { name: "VocPrez", url: "/v"};
    ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }];
});
</script>

<template>
    <h1>VocPrez Home</h1>
    <p>Welcome to VocPrez</p>
    <AdvancedSearch flavour="VocPrez" fullPage />
</template>

<style lang="scss" scoped>

</style>