<script setup lang="ts">
import { apiGet } from '@/base/lib';

const runtimeConfig = useRuntimeConfig();

const url = ref(runtimeConfig.public.prezApiEndpoint + runtimeConfig.public.prezUtilsTestPath);

const data = ref()
const tab = ref("0")
async function clk() {

    data.value = await apiGet(url.value);
}

</script>
<template>

    <NuxtLayout contentonly name="utils">

        <h1 class="text-2xl pt-4 font-bold mb-4 mb-1">lib</h1>
        <div class="text-sm mb-10">Test API endpoints, view TTL responses</div>

        <div class="flex flex-col gap-2">
            <label for="url">Test URL</label>
            <input type="url" v-model="url" placeholder="Test URL" aria-describedby="url-help"/>
            <small id="url-help">The test URL used to query the endpoints below</small>
        </div>

        <button>Hello</button>
        <div>
            <div>
                <span @click="tab = '0'">Catalogs</span>
                <span @click="tab = '1'">Catalog Item</span>
                <span @click="tab = '2'">Collections</span>
            </div>
            <div>
                <div v-if="tab === '0'">

                </div>
                <div v-if="tab === '1'">
                    More Stuff
                </div>
                <div v-if="tab === '2'">

                </div>
            </div>
        </div>

    <button @click="clk">API Get</button>

    <hr>
    {{ data }}

    </NuxtLayout>

</template>