<script setup lang="ts">

import { ref, onMounted, defineProps, watch } from 'vue';
import { getList, search, type PrezDataList, type PrezDataItem, type PrezDataSearch, type PrezNode, PrezItem, PrezData, getItem } from "prez-lib";
import WithTheme from './WithTheme.vue';
import { PrezUIDataProviderProps } from '@/types.ts';

const props = defineProps<PrezUIDataProviderProps>();

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
    <WithTheme component="PrezUIDataProvider" :info="`URL: ${props.url}\n\nContents:\n${JSON.stringify(rawData)}`">
        <template v-if="loading">
            <slot name="loading">
                <PrezUILoading :theme="props.theme"  />
            </slot>
        </template>
        <template v-else-if="error">
            <slot name="error" :error="error">
                <PrezUIMessage :theme="props.theme" severity="error" :text="error.message" />
            </slot>
        </template>
        <template v-else-if="data">
            <slot :theme="props.theme" :data="data" :debug="props.debug" :properties="properties"></slot>
        </template>
    </WithTheme>
</template>
<!-- 
Slots:
- loading: What to show when loading
- error: What to show on error
- default: Default slot to show when data is received
-->