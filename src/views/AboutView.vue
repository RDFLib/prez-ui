<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "About | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "About", url: "/about" }];
});
</script>

<template>
    <h1>About Prez</h1>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic ex at nobis obcaecati? Praesentium tenetur inventore ratione temporibus cumque incidunt quo, recusandae, labore voluptatibus repudiandae iure deserunt maxime similique placeat.</p>
    <h2>License</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi deleniti harum amet iste voluptatum at accusantium rerum doloremque magnam impedit, et beatae, cupiditate voluptas. Quas modi rerum veritatis nemo consequuntur?</p>
    <h2>Documentation</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id tenetur eos labore totam. A dolorum nemo odit culpa labore commodi, quisquam sunt ea, non doloremque enim mollitia itaque consequatur adipisci?</p>
</template>

<style lang="scss" scoped>

</style>