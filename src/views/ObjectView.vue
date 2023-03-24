<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Get Object by URI | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "Get Object by URI", url: "/object" }];
});
</script>

<template>
    <h1 class="page-title">Get Object by URI</h1>
    <p>This page can be used to find objects by their URI (Uniform Resource Identifier) by adding <code>?uri=https://some.uri.here</code> (for example) to the end of this page's URL.</p>
    <p>This functionality will be implemented soon.</p>
</template>

<style lang="scss" scoped>

</style>