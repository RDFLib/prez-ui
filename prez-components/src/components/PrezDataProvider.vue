<script setup lang="ts">

import { ref, onMounted, defineProps, watch } from 'vue';
import { getList, search, type PrezDataList, type PrezDataItem, type PrezDataSearch, type PrezNode, PrezItem, PrezData } from "prez-lib";
import axios from 'axios';
import { loadJSON } from '../util/adapter.ts';
import WithTheme from './WithTheme.vue';

type PrezDataProviderProps = {
    debug?: boolean;
    url?: string;
    data?: object;
    type: 'list' | 'item' | 'search';
    objectId?: string;
};

const props = withDefaults(defineProps<PrezDataProviderProps>(), {debug: false});

const data = ref<PrezData>();
const loading = ref(false);
const error = ref<Error>();
const properties = ref<PrezNode[]>([]);
const rawData = ref('');

const fetchData = async () => {

    error.value = undefined;
    loading.value = false;
    data.value = undefined;
    properties.value = [];

    if(!props.url) {
        error.value = new Error('No data URL provided')
        return
    }

    loading.value = true;
    try {
        switch(props.type) {
            case 'list':
                {
                    const resp = await axios.get(props.url);
                    rawData.value = resp.data;
                    data.value = await loadJSON(resp.data);
                }
            //                data.value = await getList(props.url);
                break;
            case 'item':
                console.log("LOADING ITEM")
                const resp = await axios.get(props.url);
                rawData.value = resp.data;
                const prezItem = await loadJSON(resp.data);
                data.value = prezItem;
                console.log("DATA OBJ RETURNED", prezItem);
                break;
            case 'search':
                data.value = await search(props.url);
                break;
        }
        //properties.value = getProperties();
    } catch (err) {
        error.value = err as Error;
        console.error('Error fetching data:', err);
    } finally {
        loading.value = false;
    }
};

// Watch the `url` prop for changes and refetch data accordingly
watch(
    () => props.url,
    async (newUrl?:string, oldUrl?:string) => {
        if (newUrl !== oldUrl) {
            await fetchData();
        }
    },
    { immediate: true }
);

onMounted(async () => {
    await fetchData();
});
</script>
<template>
    <WithTheme component="PrezDataProvider" :info="`URL: ${props.url}\n\nContents:\n${JSON.stringify(rawData)}`">
        <template v-if="loading">
            <slot name="loading">
                <PrezUILoading />
            </slot>
        </template>
        <template v-else-if="error">
            <slot name="error" :error="error">
                <PrezUIMessage severity="error">{{ error }}</PrezUIMessage>
            </slot>
        </template>
        <template v-else-if="data">
            <slot :data="data" :debug="props.debug" :properties="properties"></slot>
        </template>
    </WithTheme>
</template>
