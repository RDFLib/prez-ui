<script setup lang="ts">

import { ref, onMounted, defineProps } from 'vue';
import { getList, type PrezList } from "prez-lib";
import { type PrezDataListProviderProps } from './PrezDataListProvider.d';


const props = defineProps<PrezDataListProviderProps>();

const data = ref<PrezList>();
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
        data.value = await getList(props.url);
    } catch (err) {
        error.value = err as Error;
        console.error('Error fetching data:', err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
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
                <PrezUIMessage severity="error">{{ error.message }}</PrezUIMessage>
            </slot>
        </template>
        <template v-else>
            <slot :data="data"></slot>
        </template>

    </div>
</template>
