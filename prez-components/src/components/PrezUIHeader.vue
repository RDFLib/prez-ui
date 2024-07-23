<script lang="ts" setup>
import type { PrezUIHeaderProps } from '../types';
import { PrezNode } from 'prez-lib';
const props = defineProps<PrezUIHeaderProps>();
const term = props.term as PrezNode;
</script>
<template>
    <PrezUI v-bind="props" title="PrezUIHeader" :info="term">
        <div class="prezui-header">
            <div class="prezui-header-title">
                <PrezUINode :term="term"></PrezUINode>
            </div>
            <div v-if="term.description" class="prezui-header-desc">
                <PrezUILiteral :term="term.description"></PrezUILiteral>
            </div>
        </div>
    </PrezUI>
</template>
<style scoped>
.prezui-header-title {
    font-size: x-large;
}
</style>