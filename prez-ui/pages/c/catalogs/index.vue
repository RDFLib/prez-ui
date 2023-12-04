<script lang="ts" setup>
import { getCatalogs, type ListItem } from "prez-lib";
const API_BASE_URL = "https://d1sx2k22urhvtf.cloudfront.net";

const catalogs = ref<ListItem[]>([]);

onMounted(async () => {
    catalogs.value = await getCatalogs(API_BASE_URL);
});
</script>

<template>
    <h1>Catalogs</h1>
    <ListTable :items="catalogs" />
</template>

<style lang="scss" scoped>

</style>