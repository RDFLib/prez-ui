<script setup lang="ts">

import { ref, onMounted, defineProps, watch, provide } from 'vue';
import type { PrezNode, PrezData, PrezFocusNode, PrezConceptNode } from "@prez-ui/lib";
import { getItem, getList, search, getBaseUrl } from "@prez-ui/lib";
import type { DataProviderProps } from '../types';

const props = defineProps<DataProviderProps>();

const data = ref<PrezData>();
const loading = ref(false);
const error = ref<Error>();
const properties = ref<PrezNode[]>([]);
const rawData = ref('');
const url = ref(props.url || (props.baseUrl! + props.urlPath));
const baseUrl = props.baseUrl || getBaseUrl(url.value);

const loadingVariant = props.loadingVariant || props.type;

provide('data', data);
provide('loading', loading);
provide('error', error);
provide('url', url);
provide('baseUrl', baseUrl);

const fetchData = async () => {

    error.value = undefined;
    loading.value = false;
    data.value = undefined;
    properties.value = [];

    // Function to simulate a minimum loading time
    const minimumLoadingTime = () => {
        return new Promise(resolve => setTimeout(resolve, 200));
    };

    if(!props.url) {
        error.value = new Error('No data URL provided')
        return
    }

    loading.value = true;
    try {
//        console.log("FETCHING ", props.type)
        const func = props.type == 'list' ? getList(props.url)
            : props.type == 'item' ? getItem(props.url)
            : props.type == 'search' ? search(props.url)
            : undefined;

        if(!func) throw new Error(`Unknown type "${props.type}"`)

        // Simulate an async data fetch (e.g., an API call)
        const asyncRequest = async () => {
            const response = await func;
            return await response;
        };    

        // Wait for both the async request and the minimum loading time
        data.value = await Promise.all([asyncRequest(), minimumLoadingTime()]).then(
            ([result]) => result
        );
        rawData.value = JSON.stringify(data.value);

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
    <template v-if="loading">
        <slot name="loading">
            <Loading :variant="loadingVariant"/>
        </slot>
    </template>
    <template v-else-if="error">
        <slot name="error" :error="error">
            <Message severity="error" :text="error.message" />
        </slot>
    </template>
    <template v-else-if="data">
        <slot 
            :data="data" 
            :item="data.data as PrezFocusNode"
            :list="data.data as PrezFocusNode[]"
            :concepts="data.data as PrezConceptNode[]"
            :parents="data.parents"
            :properties="properties"
            :profiles="data.profiles"
            :type="data.type"
            :url="url"
            :base-url="baseUrl"
        />
    </template>
</template>
<!-- 
Slots:
- loading: What to show when loading
- error: What to show on error
- default: Default slot to show when data is received
-->