<script lang="ts" setup>
import { PrezUIPageLayoutProps } from '../types';
const props = defineProps<PrezUIPageLayoutProps>();
const variant = props.variant || 'stacked';
</script>

<template>

    <PrezUI v-bind="props" component="PrezUIPageLayout">
        <template v-if="variant == 'stacked'">
            <div class="pz-page-header"><slot name="header"><PrezUIPageHeader :variant="variant" /></slot></div>
            <div class="pz-page-menu"><slot name="menu"><PrezUIPageMenu :variant="variant" /></slot></div>
            <div class="pz-page-body"><slot name="body"></slot></div>
            <div class="pz-page-footer"><slot name="footer"><PrezUIPageFooter :variant="variant"/></slot></div>
        </template>

        <template v-else-if="variant == 'sidebar'">
            <div class="pz-page-header"><slot name="header"><PrezUIPageHeader :variant="variant" /></slot></div>
            <div class="pz-page-main">
                <div class="pz-page-menu"><slot name="menu"><PrezUIPageMenu :variant="variant" /></slot></div>
                <div class="pz-page-body"><slot name="body"></slot></div>
            </div>
            <div class="pz-page-footer"><slot name="footer"><PrezUIPageFooter :variant="variant"/></slot></div>
        </template>
    </PrezUI>
    
</template>
<style lang="scss" scoped>
</style>
