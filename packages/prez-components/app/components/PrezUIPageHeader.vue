<script lang="ts" setup>
import type { PrezUIPageHeaderProps } from '../types';
const props = defineProps<PrezUIPageHeaderProps>();
const variant = props.variant || 'stacked';
</script>
<template>
    <slot name="wrapper" :variant="variant">
        <div :class="`pz-page-header ${variant}`">
            <slot :variant="variant">
                <h1>PrezUI<br><small><em>({{ variant }})</em></small></h1>
            </slot>
        </div>
    </slot>
</template>
<style scoped>
.pz-page-header {
    padding:5px 0 5px 20px;
    background-color: black;
    color: white;
}
.pz-page-header small {
    font-size:small;
}
</style>