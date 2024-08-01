<script lang="ts" setup>
import type { PrezUILinkProps } from '../types';
const props = defineProps<PrezUILinkProps>();
</script>

<template>
    <slot name="wrapper" :href="props.href" :title="props.title" :target="props.target" :rel="props.rel">
        <a :class="`prezui-link ${props.variant}`" :href="props.href" :title="props.title" :target="props.target" :rel="props.rel">
            <slot />
        </a>
    </slot>
</template>

<style scoped>
</style>