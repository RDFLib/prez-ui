<script lang="ts" setup>
import type { PrezUIHeaderProps } from '../types';
import PrezUITerm from './PrezUITerm.vue';
import PrezUIDebug from './PrezUIDebug.vue';
import { PrezNode } from 'prez-lib';
const props = defineProps<PrezUIHeaderProps>();
const term = props.term as PrezNode;
</script>
<template>
    <PrezUIDebug :debug="props.debug" title="PrezUIHeader" :info="term">
        <div class="prezui-header">
            <div class="prezui-header-title">
                <PrezUITerm :debug="props.debug" :term="term"></PrezUITerm>
            </div>
            <div v-if="term.description" class="prezui-header-desc">
                <PrezUITerm :debug="props.debug" :term="term.description"></PrezUITerm>
            </div>
        </div>
    </PrezUIDebug>
</template>
<style scoped>
.prezui-header-title {
    font-size: x-large;
}
</style>