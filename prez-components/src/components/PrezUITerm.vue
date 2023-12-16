<script lang="ts" setup>
import { PrezLiteral, PrezNode } from 'prez-lib';
import type { PrezUITermProps } from '../types';
import PrezUILiteral from './PrezUILiteral.vue';
import PrezUINode from './PrezUINode.vue';

const props = defineProps<PrezUITermProps>();

</script>
<template>
    <p class="prezui-term">
        <PrezUILiteral v-if="props.term.termType=='Literal'" :term="(props.term as PrezLiteral)" />
        <PrezUINode v-if="props.term.termType=='Node'" :term="(props.term as PrezNode)" />
    </p>
</template>

