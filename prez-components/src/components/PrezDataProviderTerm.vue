<script setup lang="ts">

import { ref, onMounted, defineProps } from 'vue';
import { getList, getItem, search, type PrezDataList, type PrezDataItem, type PrezDataSearch, PrezNode } from "prez-lib";
import PrezUILoading from './PrezUILoading.vue';
import PrezUIMessage from './PrezUIMessage.vue';

type PrezDataProviderProps = {
    url?: string;
    data?: object;
    type: 'list' | 'object' | 'search' | 'term';
    objectId?: string;
};

const props = defineProps<PrezDataProviderProps>();

const data = ref<PrezDataList|PrezDataItem|PrezDataSearch>();
const loading = ref(false);
const error = ref<Error>();
const properties = ref<PrezNode[]>([]);

function getProperties():PrezNode[] {
    if (!data.value?.data) return [];
    
    const list:PrezNode[] = props.type == 'search' ? (data.value! as PrezDataSearch).data.map(prop => prop.predicate).flat(1)
        : (props.type == 'list' ? (data.value! as PrezDataList).data : [(data.value! as PrezDataItem).data])
            .map(item => Object.values(item.properties).map(prop => prop.predicate)).flat(1)

    const iris:string[] = [];
    const p:PrezNode[] = [];
    for(const item of list) {
        if (!iris.includes(item.value)) {
            p.push(item);
            iris.push(item.value);
        }
    }

    return p;
}

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
        properties.value = getProperties();
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
        <p><small>Data provider URL: {{ url }}</small></p>
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
            <slot :data="data" :properties="properties"></slot>
        </template>

    </div>
</template>
