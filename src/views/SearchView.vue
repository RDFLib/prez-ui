<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";

const route = useRoute();
const ui = useUiStore();

const query = ref(route.query as {[key: string]: string});
const results = ref([]);

function getResults() {
    console.log("API request...");
}

watch(() => route.query, (newValue, oldValue) => {
    if (Object.keys(newValue).length > 0 && newValue !== oldValue) {
        getResults();
    }
}, { deep: true });

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Advanced Search | Prez";
    ui.pageHeading = { name: "Prez", url: "/" };
    ui.breadcrumbs = [{ name: "Advanced Search", url: "/search" }];
    if (Object.keys(route.query).length > 0) {
        getResults();
    }
});
</script>

<template>
    <h1>Advanced Search</h1>
    <AdvancedSearch :query="query" fullPage/>
</template>

<style lang="scss" scoped>

</style>