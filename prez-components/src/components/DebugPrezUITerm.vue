<script lang="ts" setup>
import { PrezLiteral, PrezNode } from 'prez-lib';
import type { PrezUITermProps } from '../types';
import DebugPrezUILiteral from './DebugPrezUILiteral.vue';
import DebugPrezUINode from './DebugPrezUINode.vue';
const props = defineProps<PrezUITermProps>();
</script>
<template>
    <p class="term">
        PREZUI-TERM:
        <DebugPrezUILiteral v-if="props.term.termType=='Literal'" :term="(props.term as PrezLiteral)" />
        <DebugPrezUINode v-if="props.term.termType=='Node'" :term="(props.term as PrezNode)" />
    </p>
</template>
<style scoped>
p {
    padding-left:20px;
}
</style>