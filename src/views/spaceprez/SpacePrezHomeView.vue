<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";

const apiBaseUrl = inject("config").apiBaseUrl;
const route = useRoute();
const ui = useUiStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/s`, () => {
        ui.updateRightNavConfig({ enabled: true, profiles: profiles, currentUrl: route.path });
        document.title = "SpacePrez | Prez";
        ui.pageHeading = { name: "SpacePrez", url: "/s"};
        ui.breadcrumbs = [{ name: "SpacePrez", url: "/s" }];
    });
});
</script>

<template>
    <h1>SpacePrez Home</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis in libero qui earum rem facilis optio culpa nobis magnam commodi. Sunt aspernatur obcaecati eos expedita aperiam magnam ipsum incidunt impedit?</p>
</template>

<style lang="scss" scoped>

</style>