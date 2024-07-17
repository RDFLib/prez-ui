<script lang="ts" setup>
import type { PrezUILinkProps } from '../types';

import WithTheme from './WithTheme.vue';

const props = defineProps<PrezUILinkProps>();

</script>

<template>
    <WithTheme v-bind="props" component="PrezUILink">
        <a class="prezui-link" :href="props.href" :title="props.title" :target="props.target" :rel="props.rel">
            <slot></slot>
        </a>
    </WithTheme>
</template>

<style scoped>
.prezui-link {
}
</style>