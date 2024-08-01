<script lang="ts" setup>
import { type PrezUIPageLayoutProps } from '../types';
import PrezUIPageLayout from './PrezUIPageLayout.vue';
const props = defineProps<PrezUIPageLayoutProps>();
</script>
<template>
    <PrezUIPageLayout :variant="props.variant">

        <template #body>
            <slot name="wrapper" :variant="props.variant">
                <div class="pz-static-body">
                    <slot :variant="props.variant" />
                </div>
            </slot>
        </template>

    </PrezUIPageLayout>
</template>
<style lang="scss" scoped>
.pz-static-body {
    padding:20px;
}
</style>
