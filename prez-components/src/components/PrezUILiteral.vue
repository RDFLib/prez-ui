<script lang="ts" setup>
import type { PrezUILiteralProps } from '../types';
import Chip from "primevue/chip";
import PrezUINode from './PrezUINode.vue';
const props = defineProps<PrezUILiteralProps>();
</script>
<template>
    <p class="prezui-literal">
        <p class="prezui-text">
            {{ props.term.text }}
            <Chip class="prezui-language" v-if="props.term.language !== undefined" :label="props.term.language" />
            <PrezUINode size="small" class="prezui-datatype" v-if="props.term.dataType !== undefined" :term="props.term.dataType" />
        </p>
    </p>
</template>
<style scoped>
.prezui-language {
    float:right;
}
</style>