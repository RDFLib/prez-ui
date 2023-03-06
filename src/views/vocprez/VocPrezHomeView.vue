<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import VocPrezSearch from "@/components/VocPrezSearch.vue";

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
    <VocPrezSearch />
</template>

<style lang="scss" scoped>

</style>