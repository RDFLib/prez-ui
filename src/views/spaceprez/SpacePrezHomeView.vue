<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import SpacePrezSearchMap from "@/components/search/SpacePrezSearchMap.vue";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Spatial Data Home | Prez";
    ui.pageHeading = { name: "SpacePrez", url: "/s"};
    ui.breadcrumbs = [{ name: getPrezSystemLabel("SpacePrez") + " Home", url: "/s" }];
});
</script>

<template>
    <h1>Spatial Data</h1>
    <p>
        A spatial catalog of features conforming to DCAT and GeoSPARQL, delivered in both human and machine-readable views. 
    </p>
    <p>
        The system provides a set of RDF APIs and also an OGC API for Feature Collections and Features.
        See the <RouterLink to="/docs">API Documentation</RouterLink> for more information.
    </p>
    <SpacePrezSearchMap />
</template>

<style lang="scss" scoped>

</style>