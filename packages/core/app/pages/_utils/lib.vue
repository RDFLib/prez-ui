<script setup lang="ts">
import { apiGet } from '@/lib/service';

const API_BASE_URL = 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com';

const data = ref()
async function clk() {

    data.value = await apiGet(API_BASE_URL)
}

</script>
<template>

    <NuxtLayout contentonly name="utils">

    <button @click="clk">API Get</button>

    <hr>
    {{ data }}

    </NuxtLayout>

</template>