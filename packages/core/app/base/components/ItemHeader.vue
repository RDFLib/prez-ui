<script lang="ts" setup>
import type { PrezNode, PrezTerm } from '@/base/lib';

interface Props {
    term: PrezTerm;    
}

const props = defineProps<Props>();
const term = props.term as PrezNode;
</script>
<template>
    <!-- ItemHeader -->
    <div class="prezui-header">
        <div class="prezui-header-title">
            <Node :term="term" variant="item-header" />
        </div>
        <div v-if="term.description" class="text-base">
            <Literal :term="term.description" variant="item-header" />
        </div>
    </div>
</template>
<style scoped>
.prezui-header-title {
    font-size: x-large;
}
</style>