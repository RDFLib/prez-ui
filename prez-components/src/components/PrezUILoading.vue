<script setup lang="ts">
import { PrezUILoadingProps } from '..';
const props = defineProps<PrezUILoadingProps>();
const variant = props.variant || 'item';
</script>

<template>
    <PrezUI v-bind="props" component="PrezUILoading">
        <slot :variant="variant">
            <div class="prezui-loading">
                <slot v-if="variant == 'list'" name="list">Loading list...</slot>
                <slot v-else-if="variant == 'search'" name="search">Loading results...</slot>
                <slot v-else name="item">Loading item...</slot>
            </div>
        </slot>
    </PrezUI>
</template>

<style scoped>
.prezui-loading {
    background-color: #eee;
}
</style>