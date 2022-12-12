<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Get Object by IRI | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "Get Object by IRI", url: "/object" }];
});
</script>

<template>
    <h1>Get Object by IRI</h1>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic ex at nobis obcaecati? Praesentium tenetur inventore ratione temporibus cumque incidunt quo, recusandae, labore voluptatibus repudiandae iure deserunt maxime similique placeat.</p>
</template>

<style lang="scss" scoped>

</style>