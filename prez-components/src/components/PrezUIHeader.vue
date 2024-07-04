<script lang="ts" setup>
import type { PrezUIHeaderProps } from '../types';
import PrezUITerm from './PrezUITerm.vue';
import PrezUIDebug from './PrezUIDebug.vue';
const props = defineProps<PrezUIHeaderProps>();

</script>
<template>    
    <PrezUIDebug :debug="props.debug" title="PrezUIHeader" :info="props.term">
        <div class="prezui-header">
            <div class="prezui-header-title">
                <PrezUITerm :debug="props.debug" :term="props.term"></PrezUITerm>
            </div>
            <div v-if="props.term.description" class="prezui-header-desc">
                <PrezUITerm :debug="props.debug" :term="props.term.description"></PrezUITerm>
            </div>
        </div>
    </PrezUIDebug>
</template>
<style scoped>
.prezui-header-title {
    font-size: x-large;
}
</style>