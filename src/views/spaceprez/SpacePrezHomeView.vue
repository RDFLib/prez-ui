<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import SpacePrezSearchMap from "@/components/search/SpacePrezSearchMap.vue";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "SpacePrez | Prez";
    ui.pageHeading = { name: "SpacePrez", url: "/s"};
    ui.breadcrumbs = [{ name: "SpacePrez", url: "/s" }];
});
</script>

<template>
    <h1>SpacePrez Home</h1>
    <p>Welcome to SpacePrez</p>
    <SpacePrezSearchMap />
</template>

<style lang="scss" scoped>

</style>