<template>
    <PrezUINode v-bind="props" theme="default" v-slot="slotProps">
        <a :href="slotProps.link" v-tooltip.bottom="slotProps.tooltip">{{ slotProps.label }}</a>
    </PrezUINode>
</template>
<script lang="ts" setup>
import PrezUINode from '../../components/PrezUINode.vue';
import { PrezUINodeProps } from '../../types';
const props = defineProps<PrezUINodeProps>();
</script>