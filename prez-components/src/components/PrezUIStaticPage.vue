<script lang="ts" setup>
import { PrezUIDataPageProps } from '../types';
const props = defineProps<PrezUIDataPageProps>();
</script>
<template>

    <PrezUI v-bind="props" component="PrezUIStaticPage">
        <PrezUIPageLayout :variant="props.variant">

            <template #body>
                <slot name="wrapper" :variant="props.variant">
                    <div class="pz-static-body">
                        <slot :variant="props.variant"></slot>
                    </div>
                </slot>
            </template>

        </PrezUIPageLayout>
    </PrezUI>

</template>
<style lang="scss" scoped>
.pz-static-body {
    padding:20px;
}
</style>
