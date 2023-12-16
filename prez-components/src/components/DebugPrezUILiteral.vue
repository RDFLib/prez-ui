<script lang="ts" setup>
import type { PrezUILiteralProps } from '../types';
import DebugPrezUINode from './DebugPrezUINode.vue';
const props = defineProps<PrezUILiteralProps>();
</script>
<template>
    <p>
        PREZUI-LITERAL:
        <p>TEXT: <span class="text">{{ props.term.text }}</span></p>
        <p v-if="props.term.language !== undefined">LANG: <span class="text">{{ props.term.language }}</span></p>
        <p class="datatype" v-if="props.term.dataType !== undefined">DATA TYPE: <DebugPrezUINode :term="props.term.dataType" /></p>
    </p>
</template>
<style scoped>
p {
    padding-left:20px;
}
</style>