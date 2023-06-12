<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import CatPrezSearchMap from '@/components/search/CatPrezSearchMap.vue'
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Data Catalog Home | Prez";
    ui.pageHeading = { name: "CatPrez", url: "/c"};
    ui.breadcrumbs = [{ name: getPrezSystemLabel("CatPrez") + " Home", url: "/c" }];
});
</script>

<template>
    <h1 class="page-title">Data Catalog</h1>
    <p>
        A general data catalog conforming to <a href="https://www.w3.org/TR/vocab-dcat-2/">DCAT</a>, delivered 
        as a read-only web system in both human and machine-readable views.
        The views are known as profiles and a list of them are available <RouterLink to="/s/profiles">here</RouterLink>.
    </p>
    <!-- <p>Welcome to CatPrez - a read-only web delivery system for Data Catalog Vocabulary (DCAT) information.</p> -->

    <CatPrezSearchMap />
</template>

<style lang="scss" scoped>

</style>