<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import PropTableView from "@/views/PropTableView.vue";

const route = useRoute();
const ui = useUiStore();

onMounted(() => {
    if (!route.query) {
        ui.rightNavConfig = { enabled: false };
        document.title = "Get Object by URI | Prez";
        ui.pageHeading = { name: "Prez", url: "/"};
        ui.breadcrumbs = [{ name: "Get Object by URI", url: "/object" }];
    }
});
</script>

<template>
    <PropTableView v-if="route.query && route.query.uri" />
    <template v-else>
        <h1 class="page-title">Get Object by URI</h1>
        <p>This page can be used to find objects by their URI (Uniform Resource Identifier) by adding <code>?uri=https://some.uri.here</code> (for example) to the end of this page's URL.</p>
    </template>
</template>

<style lang="scss" scoped>

</style>