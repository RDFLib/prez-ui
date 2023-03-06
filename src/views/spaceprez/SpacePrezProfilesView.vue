<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig } from "@/types";

const { apiBaseUrl } = inject(configKey, defaultConfig);
const ui = useUiStore();
const { data, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/s/profiles`, () => {
        // parse profile data

        ui.rightNavConfig = { enabled: false };
        document.title = "SpacePrez Profiles | Prez";
        ui.pageHeading = { name: "SpacePrez", url: "/s"};
        ui.breadcrumbs = [{ name: "SpacePrez", url: "/s" }, { name: "Profiles", url: "/s/profiles" }];
    });
});
</script>

<template>
    <h1>SpacePrez Profiles</h1>
    <p>Profiles for SpacePrez</p>
</template>

<style lang="scss" scoped>

</style>