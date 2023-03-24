<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Not Found | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [];
});
</script>

<template>
    <h1 class="page-title">Not Found</h1>
    <p>Sorry, this page does not exist.</p>
    <p><RouterLink class="btn" to="/">Go home</RouterLink></p>
</template>

<style lang="scss" scoped>

</style>