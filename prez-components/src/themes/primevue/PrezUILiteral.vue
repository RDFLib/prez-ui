<template>
    <PrezUILiteral v-bind="props" theme="default">
        <template #language="{ language }">
            <Tag severity="info" :value="language" />
        </template>
        <template #datatype="{ datatype }">
            <Tag severity="info"><PrezUITerm :term="datatype" /></Tag>
        </template>
    </PrezUILiteral>
</template>
<script lang="ts" setup>
import PrezUILiteral from '@/components/PrezUILiteral.vue';
import { PrezUILiteralProps } from '@/types';
import Tag from 'primevue/tag';
const props = defineProps<PrezUILiteralProps>();
</script>