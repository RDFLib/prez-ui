<script lang="ts" setup>
import { getCatalog, type ObjectItem } from "prez-lib";

const route = useRoute();

const API_BASE_URL = "https://d1sx2k22urhvtf.cloudfront.net";

const catalog = ref<ObjectItem>({} as ObjectItem);

onMounted(async () => {
    catalog.value = await getCatalog(API_BASE_URL, route.params.catalogId as string);
});
</script>

<template>
    <h1>{{ catalog.label || catalog.uri }}</h1>
    <p v-if="catalog.description"><em>{{ catalog.description }}</em></p>
    <ObjectTable :properties="catalog.properties" />
</template>

<style lang="scss" scoped>

</style>