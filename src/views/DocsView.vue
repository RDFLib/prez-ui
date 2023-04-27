<script lang="ts" setup>
import { onMounted, inject } from "vue";
import { useUiStore } from "@/stores/ui";
import { apiBaseUrlConfigKey } from "@/types";

const ui = useUiStore();
const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "API Documentation | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "API Documentation", url: "/docs" }];
});
</script>

<template>
    <h1 class="page-title">API Documentation</h1>
    <p>This page lists the available endpoints of the Prez API for this instance.</p>
    <iframe :src="`${apiBaseUrl}/docs`" frameborder="0" name="docs" title="Prez API Swagger Docs"></iframe>
</template>

<style lang="scss" scoped>
iframe {
    width: 100%;
    height: 100%;
}
</style>