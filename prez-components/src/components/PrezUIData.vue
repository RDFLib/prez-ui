<script lang="ts" setup>
import type { PrezUIDataProps } from '@/types';
import { PrezDataItem, PrezDataList } from 'prez-lib';
import PrezUIMessage from './PrezUIMessage.vue';
const props = defineProps<PrezUIDataProps>();
</script>
<template>
    <WithTheme v-bind="props" component="PrezUIData" :info="props.data">
        <PrezUIDataItem v-if="props.data.type == 'item'" :item="(data as PrezDataItem)" />
        <PrezUIDataList v-else-if="props.data.type == 'list'" :list="(data as PrezDataList)" />
        <PrezUIMessage severity="error" v-else>Unknown type "{{ props.data.type }}"</PrezUIMessage>
    </WithTheme>
</template>
