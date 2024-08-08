<script lang="ts" setup>
import type { ItemHeaderProps } from '../types';
import type { PrezNode } from '@/lib';
const props = defineProps<ItemHeaderProps>();
const term = props.term as PrezNode;
</script>
<template>
    <div class="prezui-header">
        <div class="prezui-header-title">
            <Node :term="term" variant="header" />
        </div>
        <div v-if="term.description" class="prezui-header-desc">
            <Literal :term="term.description" variant="header" />
        </div>
    </div>
</template>
<style scoped>
.prezui-header-title {
    font-size: x-large;
}
</style>