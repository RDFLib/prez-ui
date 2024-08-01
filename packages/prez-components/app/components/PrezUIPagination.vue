<script setup lang="ts">
import type { PrezUIPaginationProps } from '../types';
import PrezUILink from './PrezUILink.vue';

const props = defineProps<PrezUIPaginationProps>();
const page = props.page || 1;

const numPages = Math.floor(((props.totalCount - 1) / props.rows) + 1);
//const maxPagesToSkip = props.maxPagesToSkip || 5;

</script>

<template>
    <slot :variant="props.variant">
        <template v-if="props.page > 1 || props.rows > 0">
            <template v-if="page > 1">
                <PrezUILink :to="`?page=${page - 1}`" title="Previous page">Prev</PrezUILink> |
                <span v-for="i in page - 1" :key="i">
                    <PrezUILink :to="`?page=${i}`" :title="`Page ${i}`">{{ i }}</PrezUILink> |
                </span>
            </template>
            <b>{{ page }}</b>
            <template v-if="page < numPages">
                <span v-for="i in numPages - page" :key="i">
                    | <PrezUILink :to="`?page=${i}`" :title="`Page ${i + page}`">{{ i + page }}</PrezUILink>
                </span>
            </template>
            <span v-if="page < numPages">
                | <PrezUILink :to="`?page=${numPages}`" title="Next page">Next</PrezUILink>
            </span>
            {{ numPages == 1 ? ' page' : '' }}
        </template>
    </slot>
</template>

<style scoped>
.prezui-loading {
    background-color: #eee;
}
</style>