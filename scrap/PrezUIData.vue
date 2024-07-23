<script lang="ts" setup>
import type { PrezUIDataProps } from '@/types';
import { PrezDataItem, PrezDataList } from 'prez-lib';
import PrezUIMessage from './PrezUIMessage.vue';
const props = defineProps<PrezUIDataProps>();
const data = props.data;
</script>
<template>
    <WithTheme v-bind="props" component="PrezUIData" :info="data">
        <PrezUIDataItem :theme="props.theme" v-if="data.type == 'item'" :item="(data as PrezDataItem)" />
        <PrezUIDataList :theme="props.theme" v-else-if="data.type == 'list'" :list="(data as PrezDataList)" />
        <PrezUIMessage :theme="props.theme" severity="error" v-else>Unknown type "{{ data.type }}"</PrezUIMessage>
    </WithTheme>
</template>
