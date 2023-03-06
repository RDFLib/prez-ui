<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import CatPrezSearch from "@/components/CatPrezSearch.vue";

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
    <CatPrezSearch />
</template>

<style lang="scss" scoped>

</style>