<script setup lang="ts">
import { apiGet } from '@prez-ui/lib';

const runtimeConfig = useRuntimeConfig();

const url = ref(runtimeConfig.public.prezApiEndpoint + runtimeConfig.public.prezUtilsTestPath);

const data = ref()
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
            <InputText v-model="url" placeholder="Test URL" :value="url" aria-describedby="url-help"/>
            <small id="url-help">The test URL used to query the endpoints below</small>
        </div>

        <Button>Hello</Button>

        <Tabs value="0">
            <TabList>
                <Tab value="0">Catalogs</Tab>
                <Tab value="1">Catalog Item</Tab>
                <Tab value="2">Collections</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    
                </TabPanel>
                <TabPanel value="1">
                    More Stuff
                </TabPanel>
            </TabPanels>
        </Tabs>

    <Button @click="clk">API Get</Button>

    <hr>
    {{ data }}

    </NuxtLayout>

</template>