<script lang="ts" setup>
import type { PrezUITermProps } from "../types";
import PrezUINode from "./PrezUINode.vue";
import PrezUILiteral from "./PrezUILiteral.vue";
import PrezUIBlankNode from "./PrezUIBlankNode.vue";

const props = defineProps<PrezUITermProps>();
</script>

<template>
    <PrezUINode v-if="props.termType === 'NamedNode'" v-bind="props" />
    <PrezUILiteral v-else-if="props.termType === 'Literal'" v-bind="props" />
    <PrezUIBlankNode v-else-if="props.termType === 'BlankNode'" v-bind="props" />
</template>
