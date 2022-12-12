<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "About SpacePrez | Prez";
    ui.pageHeading = { name: "SpacePrez", url: "/s"};
    ui.breadcrumbs = [{ name: "SpacePrez", url: "/s" }, { name: "About", url: "/s/about" }];
});
</script>

<template>
    <h1>About SpacePrez</h1>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic ex at nobis obcaecati? Praesentium tenetur inventore ratione temporibus cumque incidunt quo, recusandae, labore voluptatibus repudiandae iure deserunt maxime similique placeat.</p>
</template>

<style lang="scss" scoped>

</style>