<script setup lang="ts">

import { ref, onMounted, defineProps } from 'vue';
import { getList, getItem, search, type PrezDataList, type PrezDataItem, type PrezDataSearch } from "prez-lib";
import { type PrezDataProviderProps } from './PrezDataProvider.d';
import PrezUILoading from './PrezUILoading.vue';
import PrezUIMessage from './PrezUIMessage.vue';

const props = defineProps<PrezDataProviderProps>();

const data = ref<PrezDataList|PrezDataItem|PrezDataSearch>();
const loading = ref(false);
const error = ref<Error>();

const fetchData = async () => {

    error.value = undefined
    loading.value = false
    data.value = undefined

    if(!props.url) {
        error.value = new Error('No data URL provided')
        return
    }

    loading.value = true;
    try {
        switch(props.type) {
            case 'list':
                data.value = await getList(props.url);
                break;
            case 'object':
                data.value = await getItem(props.url, props.objectId!);
                console.log("VAL", data.value)
                break;
            case 'search':
                data.value = await search(props.url);
                break;
        }
    } catch (err) {
        error.value = err as Error;
        console.error('Error fetching data:', err);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await fetchData();
});
</script>
<template>
    <div>
        {{ url }}
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
        <template v-else>
            <slot :data="data"></slot>
        </template>

    </div>
</template>
./PrezDataProvider