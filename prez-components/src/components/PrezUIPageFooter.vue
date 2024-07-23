<script lang="ts" setup>
import type { PrezUIPageFooterProps } from '../types';
const props = defineProps<PrezUIPageFooterProps>();
const variant = props.variant || 'stacked';
</script>
<template>
    <PrezUI v-bind="props" component="PrezUIPageFooter">
        <slot name="wrapper" :variant="variant">
            <div :class="`pz-page-footer ${variant}`">
                <slot :variant="variant">
                    <hr />
                    <div>PrezUI Footer</div> 
                    <small><em>({{ variant }})</em></small>
                </slot>
            </div>
        </slot>
    </PrezUI>
</template>
<style scoped>
.pz-page-footer {
    padding:20px;
    text-align: center;
    font-size:medium;
    color: #999;
}
</style>