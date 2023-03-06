<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig } from "@/types";

const { apiBaseUrl } = inject(configKey, defaultConfig);
const ui = useUiStore();
const { data, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/profiles`, () => {
        // parse profile data

        ui.rightNavConfig = { enabled: false };
        document.title = "VocPrez Profiles | Prez";
        ui.pageHeading = { name: "VocPrez", url: "/v"};
        ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "Profiles", url: "/v/profiles" }];
    });
});
</script>

<template>
    <h1>VocPrez Profiles</h1>
    <p>Profiles for VocPrez</p>
</template>

<style lang="scss" scoped>

</style>