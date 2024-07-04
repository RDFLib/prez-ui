<script lang="ts" setup>
import type { PrezUIItemProps } from '../types';
import PrezUIHeader from './PrezUIHeader.vue';
import PrezUIPropertyTable from './PrezUIPropertyTable.vue';
import PrezUIDebug from './PrezUIDebug.vue';
const props = defineProps<PrezUIItemProps>();
</script>
<template>
    <PrezUIDebug :debug="props.debug" title="PrezUIItem" :info="props.item">
        <template v-if="props.item">
            <div class="prezui-focusnode">
                <PrezUIHeader :debug="props.debug" :term="props.item.focusNode" />
            </div>
            <div class="prezui-properties">
                <PrezUIPropertyTable :debug="props.debug" :properties="props.item.properties" />
            </div>
        </template>
    </PrezUIDebug>
</template>
<style scoped>

</style>