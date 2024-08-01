<script lang="ts" setup>
import type { PrezUILinkProps } from '../types';
const props = defineProps<PrezUILinkProps>();

const url = typeof(props.to) == 'string' ? props.to : props.to?.links ? props.to?.links[0]?.value : '#';
</script>

<template>
    <slot name="wrapper" :url="url" :title="props.title" :target="props.target" :rel="props.rel">
        <a :class="`prezui-link ${props.variant}`" :href="url" :title="props.title" :target="props.target" :rel="props.rel">
            <slot />
        </a>
    </slot>
</template>

<style scoped>
</style>