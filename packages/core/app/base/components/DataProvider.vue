<script setup lang="ts">

import { ref, onMounted, defineProps, watch } from 'vue';
import type { PrezNode, PrezData, PrezFocusNode, PrezConceptNode } from "@/base/lib";
import { getItem, getList, search, getBaseUrl } from "@/base/lib";
import type { DataProviderProps } from '../types';

const props = defineProps<DataProviderProps>();

const data = ref<PrezData>();
const loading = ref(false);
const hasMore = ref(false);
const error = ref<Error>();
const properties = ref<PrezNode[]>([]);
const url = ref(props.url || (props.baseUrl! + props.urlPath));
const baseUrl = ref(props.baseUrl || getBaseUrl(url.value));
const path = ref(props.urlPath ? props.urlPath : url.value.startsWith(baseUrl.value) ? url.value.substring(baseUrl.value.length) : url.value);

const loadingVariant = props.loadingVariant || props.type;

const fetchData = async () => {

    error.value = undefined;
    loading.value = false;
    properties.value = [];

    // Function to simulate a minimum loading time
    const minimumLoadingTime = () => {
        return new Promise(resolve => setTimeout(resolve, 200));
    };

    if(!url.value) {
        error.value = new Error('No data URL provided')
        return
    }

    loading.value = true;
    try {
//        console.log("FETCHING ", props.type)
        const func = props.type == 'list' ? getList(baseUrl.value, path.value)
            : props.type == 'item' ? getItem(baseUrl.value, path.value)
            : props.type == 'search' ? search(baseUrl.value, path.value)
            : undefined;

        if(!func) throw new Error(`Unknown type "${props.type}"`)
console.log("FETCHING ", props.type, props.url)
        const response = await func;

        if (props.type === 'list' && Array.isArray(response.data) && (data.value === undefined || Array.isArray(data.value.data))) {
            // Accumulate the data
            if(data.value === undefined) {
                data.value = response;
            } else {
                if(Array.isArray(data.value.data)) {
                    const arr = [...data.value.data];
                    arr.push(...response.data);
                    data.value.data = arr as PrezFocusNode[];
                } else {
                    data.value = response;
                }
            }

        } else {
            data.value = response;
        }
        hasMore.value = Array.isArray(response.data) && response.data.length > 0;

//        rawData.value = JSON.stringify(data.value);

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
    [() => props.url, () => props.baseUrl, () => props.urlPath],
    async ([newUrl, newBaseUrl, newUrlPath], [oldUrl, oldBaseUrl, oldUrlPath]) => {
        if (newUrl !== oldUrl || newBaseUrl !== oldBaseUrl || newUrlPath !== oldUrlPath) {
            await fetchData();
        }
    },
    { immediate: true }
);

onMounted(async () => {
    data.value = undefined;
    //await fetchData();
});
</script>
<template>
    {{ url }} - {{ path }}
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
            :has-more="hasMore"
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