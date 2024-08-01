<script lang="ts" setup>
import type { PrezUIHeaderProps } from '../types';
import type { PrezNode } from 'prez-lib';
import PrezUINode from './PrezUINode.vue';
import PrezUILiteral from './PrezUILiteral.vue';
const props = defineProps<PrezUIHeaderProps>();
const term = props.term as PrezNode;
</script>
<template>
    <div class="prezui-header">
        <div class="prezui-header-title">
            <PrezUINode :term="term" variant="header" />
        </div>
        <div v-if="term.description" class="prezui-header-desc">
            <PrezUILiteral :term="term.description" variant="header" />
        </div>
    </div>
</template>
<style scoped>
.prezui-header-title {
    font-size: x-large;
}
</style>