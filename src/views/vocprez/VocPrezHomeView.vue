<script setup>
import { onMounted, inject } from "vue";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";

const ui = useUiStore();
const apiBaseUrl = inject("config").apiBaseUrl;
const { data, profiles, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/v`, () => {
        ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
        document.title = "VocPrez | Prez";
        ui.pageHeading = { name: "VocPrez", url: "/v"};
        ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }];
    });
});
</script>

<template>
    <h1>VocPrez Home</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis in libero qui earum rem facilis optio culpa nobis magnam commodi. Sunt aspernatur obcaecati eos expedita aperiam magnam ipsum incidunt impedit?</p>
</template>

<style lang="scss" scoped>

</style>