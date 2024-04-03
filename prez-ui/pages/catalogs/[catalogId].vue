<script lang="ts" setup>
import { type PrezItem, getItem, type ProfileHeader } from "prez-lib";
import PrezUIObjectTable from "~/components/PrezUIObjectTable.vue"

const API_BASE_URL = "https://prez-v4-single-endpoints.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com";
const catalog = ref<PrezItem>({} as PrezItem);
const profiles = ref<ProfileHeader[]>([]);

const route = useRoute();

onMounted(async () => {
    const { data, profiles: p } = await getItem(API_BASE_URL + "/catalogs/" + route.params.catalogId, "dcat:Catalog");
    catalog.value = data;
    profiles.value = p;
})
</script>

<template>
    <div>
        <h1 v-if="catalog.focusNode">{{ catalog.focusNode.label?.value }}</h1>
        <PrezUIObjectTable v-if="catalog.properties" :properties="catalog.properties" :key="Object.keys(catalog).length" />
    </div>
</template>
