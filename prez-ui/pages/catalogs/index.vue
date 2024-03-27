<script lang="ts" setup>
import { type PrezItem, getList, type ProfileHeader } from "prez-lib";
import PrezUIItemList from "~/components/PrezUIItemList.vue"

const API_BASE_URL = "https://prez-v4-single-endpoints.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com";
const catalogs = ref<PrezItem[]>([]);
const profiles = ref<ProfileHeader[]>([]);

onMounted(async () => {
    const { data, profiles: p } = await getList(API_BASE_URL + "/catalogs", "dcat:Catalog");
    catalogs.value = data;
    profiles.value = p;
})
</script>

<template>
    <div>
        <PrezUIItemList :items="catalogs" :key="catalogs.length" />
    </div>
</template>
