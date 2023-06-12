<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import SpacePrezSearchMap from "@/components/search/SpacePrezSearchMap.vue";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Spatial Data Catalog Home | Prez";
    ui.pageHeading = { name: "SpacePrez", url: "/s"};
    ui.breadcrumbs = [{ name: getPrezSystemLabel("SpacePrez") + " Home", url: "/s" }];
});
</script>

<template>
    <h1 class="page-title">Spatial Data Catalog</h1>
    <p>
        A spatial catalog of Feature Collections and Features conforming to <a href="https://www.w3.org/TR/vocab-dcat-2/">DCAT</a> and 
        <a href="https://www.ogc.org/standard/geosparql/">GeoSPARQL</a>, and delivered as a read-only web system in both human and machine-readable views.
        The views are known as profiles and a list of them are available <RouterLink to="/s/profiles">here</RouterLink>.
    </p>
    <p>
        The system provides a set of RDF APIs and also an OGC API for Feature Collections and Features.
        See the <RouterLink to="/docs">API Documentation</RouterLink> for more information.
    </p>
    <SpacePrezSearchMap />
</template>

<style lang="scss" scoped>

</style>