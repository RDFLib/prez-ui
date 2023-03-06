<script lang="ts" setup>
import { inject, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { configKey, defaultConfig } from "@/types";

const ui = useUiStore();

const { enabledPrezs } = inject(configKey, defaultConfig);

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [];
});
</script>

<template>
    <h1>Welcome to Prez</h1>
    <p>Prez is a Linked Data API that combines VocPrez, SpacePrez (OGC API), CatPrez and the upcoming TimePrez.</p>
    <p>Each instance of Prez can either act as a collection of *Prezs or as a stand-alone instance of a single *Prez.</p>
    <div class="prez-card-container">
        <RouterLink v-if="enabledPrezs.includes('CatPrez')" class="prez-card" to="/c">
            <h3>CatPrez</h3>
            <p>CatPrez presents Data Catalog Vocabulary (DCAT) catalogue information in RDF, in various formats.</p>
        </RouterLink>
        <RouterLink v-if="enabledPrezs.includes('SpacePrez')" class="prez-card" to="/s">
            <h3>SpacePrez</h3>
            <p>SpacePrez presents GeoSPARQL spatial features in various formats. This API conforms to the Open Geospatial Consortium (OGC) API specification.</p>
        </RouterLink>
        <RouterLink v-if="enabledPrezs.includes('VocPrez')" class="prez-card" to="/v">
            <h3>VocPrez</h3>
            <p>VocPrez presents Simple Knowledge Organization System (SKOS)-formulated RDF vocabularies in various formats.</p>
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.prez-card-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .prez-card {
        padding: 20px;
        background-color: $cardBg;
        flex: 1;
        color: unset;
        border-radius: $borderRadius;

        h3 {
            margin-top: 0;
            color: $primary;
        }
    }
}
</style>