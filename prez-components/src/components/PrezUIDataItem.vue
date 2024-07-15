<script lang="ts" setup>
import type { PrezUIDataItemProps } from '../types';
import PrezUIHeader from './PrezUIHeader.vue';
import PrezUIPropertyTable from './PrezUIPropertyTable.vue';
const props = defineProps<PrezUIDataItemProps>();
const item = props.item;
</script>
<template>
    <WithTheme v-bind="props" component="PrezUIItem" :info="item">
        <template v-if="item">
            <div class="prezui-focusnode">
                <PrezUIHeader :debug="props.debug" :term="item.data.focusNode" />
            </div>
            <div class="prezui-properties">
                <PrezUIPropertyTable :debug="props.debug" :term="item.data.focusNode" :properties="item.data.properties" />
            </div>
        </template>
    </WithTheme>
</template>
<style scoped>

</style>