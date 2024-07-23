<script lang="ts" setup>
import type { PrezUIDataListProps } from '@/types';
import { literal, node } from 'prez-lib';
const props = defineProps<PrezUIDataListProps>();
const list = props.list;
</script>
<template>
    <WithTheme component="PrezUIDataList" :info="props">        
        <PrezUIHeader :debug="props.debug" :term="node({value: '', label: literal(`${list.count} records found`)})"></PrezUIHeader>
        <PrezUIList :debug="props.debug" :list="list.data" />
    </WithTheme>
</template>
<style scoped>

</style>