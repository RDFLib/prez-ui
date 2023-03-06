<script lang="ts" setup>
import { onMounted, inject } from "vue";
import { useUiStore } from "@/stores/ui";
import { configKey, defaultConfig } from "@/types";

const ui = useUiStore();
const { apiBaseUrl } = inject(configKey, defaultConfig);

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "API Docs | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "API Docs", url: "/docs" }];
});
</script>

<template>
    <h1>API Docs</h1>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic ex at nobis obcaecati? Praesentium tenetur inventore ratione temporibus cumque incidunt quo, recusandae, labore voluptatibus repudiandae iure deserunt maxime similique placeat.</p>
    <iframe :src="`${apiBaseUrl}/docs`" frameborder="0" name="docs" title="Prez API Swagger Docs"></iframe>
</template>

<style lang="scss" scoped>
iframe {
    width: 100%;
    height: 100%;
}
</style>