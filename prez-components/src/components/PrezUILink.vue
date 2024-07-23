<script lang="ts" setup>
import type { PrezUILinkProps } from '../types';
const props = defineProps<PrezUILinkProps>();
</script>

<template>
    <PrezUI v-bind="props" component="PrezUILink">
        <slot name="wrapper" :href="props.href" :title="props.title" :target="props.target" :rel="props.rel">
            <a class="prezui-link" :href="props.href" :title="props.title" :target="props.target" :rel="props.rel">
                <slot></slot>
            </a>
        </slot>
    </PrezUI>
</template>

<style scoped>
.prezui-link {
}
</style>