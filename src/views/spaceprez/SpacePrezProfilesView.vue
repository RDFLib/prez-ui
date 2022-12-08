<script setup>
import { ref, onMounted, inject } from "vue";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";

const apiBaseUrl = inject("config").apiBaseUrl;
const ui = useUiStore();
const { data, loading, error, doRequest } = useGetRequest();

onMounted(() => {
    doRequest(`${apiBaseUrl}/s/profiles`, () => {
        // parse profile data

        ui.updateRightNavConfig({ enabled: false });
        document.title = "SpacePrez Profiles | Prez";
        ui.pageHeading = { name: "SpacePrez", url: "/s"};
        ui.breadcrumbs = [{ name: "SpacePrez", url: "/s" }, { name: "Profiles", url: "/s/profiles" }];
    });
});
</script>

<template>
    <h1>SpacePrez Profiles</h1>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic ex at nobis obcaecati? Praesentium tenetur inventore ratione temporibus cumque incidunt quo, recusandae, labore voluptatibus repudiandae iure deserunt maxime similique placeat.</p>
</template>

<style lang="scss" scoped>

</style>