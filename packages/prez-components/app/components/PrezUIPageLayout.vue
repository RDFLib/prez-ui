<script lang="ts" setup>
import type { PrezUIPageLayoutProps } from '../types';
import PrezUIPageFooter from './PrezUIPageFooter.vue';
import PrezUIPageHeader from './PrezUIPageHeader.vue';
import PrezUIPageMenu from './PrezUIPageMenu.vue';
const props = defineProps<PrezUIPageLayoutProps>();
const variant = props.variant || 'stacked';
</script>

<template>
    <template v-if="variant == 'stacked'">
        <div class="pz-page-header"><slot name="header"><PrezUIPageHeader :variant="variant" /></slot></div>
        <div class="pz-page-menu"><slot name="menu"><PrezUIPageMenu :variant="variant" /></slot></div>
        <div class="pz-page-body"><slot name="body" /></div>
        <div class="pz-page-footer"><slot name="footer"><PrezUIPageFooter :variant="variant"/></slot></div>
    </template>

    <template v-else-if="variant == 'sidebar'">
        <div class="pz-page-header"><slot name="header"><PrezUIPageHeader :variant="variant" /></slot></div>
        <div class="pz-page-main">
            <div class="pz-page-menu"><slot name="menu"><PrezUIPageMenu :variant="variant" /></slot></div>
            <div class="pz-page-body"><slot name="body" /></div>
        </div>
        <div class="pz-page-footer"><slot name="footer"><PrezUIPageFooter :variant="variant"/></slot></div>
    </template>
    
</template>
<style lang="scss" scoped>
</style>
