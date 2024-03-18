<script lang="ts" setup>
import { type PrezItem, getList, node } from "prez-lib";
import PrezUIItemList from "~/components/PrezUIItemList.vue"

const API_BASE_URL = "https://prez-v4-single-endpoints.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com";
const catalogs = ref<PrezItem[]>([]);

// const catalogs: PrezItem[] = [
//     {
//         focusNode: node("https://example.com"),
//         properties: {}
//     }
// ]

onMounted(async () => {
    catalogs.value = await getList(API_BASE_URL + "/catalogs", "dcat:Catalog");
})
</script>

<template>
    <div>
        <PrezUIItemList :items="catalogs" :key="catalogs.length" />
    </div>
</template>
