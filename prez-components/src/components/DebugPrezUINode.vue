<script lang="ts" setup>
import type { PrezUINodeProps } from '../types';
import DebugPrezUITerm from './DebugPrezUITerm.vue';
const props = defineProps<PrezUINodeProps>();
</script>
<template>
    <p>
        PREZUI-NODE:
        <p v-if="props.term.label">LABEL: <DebugPrezUITerm :term="props.term.label"/></p>
        <p v-if="props.term.description">DESCRIPTION: <DebugPrezUITerm :term="props.term.description"/></p>
        <p>URI: {{ props.term.uri }}</p>
        <p v-if="props.term.curie">CURIE: {{ props.term.curie }}</p>
    </p>
</template>
<style scoped>
p {
    padding-left:20px;
}
</style>