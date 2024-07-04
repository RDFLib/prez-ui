<script lang="ts" setup>
import type { PrezUILiteralProps } from '../types';
import PrezUINode from './PrezUINode.vue';
import PrezUIDebug from './PrezUIDebug.vue';

const props = defineProps<PrezUILiteralProps>();
</script>
<template>
    <PrezUIDebug :debug="props.debug" title="PrezUILiteral" :info="props.term">
        <div class="prezui-literal" v-if="props?.term?.value">
            <div class="prezui-text">
                {{ props.term.value }}
                <span class="prezui-language" v-if="props.term.language !== undefined">{{ props.term.language }}</span>
                <PrezUINode size="small" class="prezui-datatype" v-if="props.term.datatype !== undefined" :term="props.term.datatype" />
            </div>
        </div>
    </PrezUIDebug>
</template>
<style scoped>
.prezui-language {
    float:right;
}
</style>