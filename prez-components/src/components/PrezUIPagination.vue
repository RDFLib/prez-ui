<script setup lang="ts">
import { PrezUIPaginationProps } from '@/types';
import WithTheme from './WithTheme.vue';
import { computed } from 'vue';

const props = defineProps<PrezUIPaginationProps>();
const numPages = Math.floor(((props.totalCount - 1) / props.rows) + 1);

const nextPage = computed(()=>{
    return props.page < numPages ? props.page + 1 : 0;
})
</script>

<template>
    <WithTheme v-bind="props" component="PrezUIPagination">
        <slot :variant="variant">
            <div class="prezui-pagination">
                [ Current Page: {{ props.page }} | 
                Num Pages: {{ numPages }} |
                Items Per page: {{ props.rows }} | 
                Total Records: {{ props.totalCount }} | 
                Prev page: <PrezUILink v-if="props.page > 1" title="Prev page" :href="`?page=${props.page - 1}`">Page {{ props.page - 1 }}</PrezUILink><span v-else>Start</span> |
                Next page: 
                    <PrezUILink v-if="nextPage" title="Next page" :href="`?page=${nextPage}`">Page {{ nextPage }}</PrezUILink>
                    <span v-else>End</span>
                ]
            </div>
        </slot>
    </WithTheme>
</template>

<style scoped>
.prezui-loading {
    background-color: #eee;
}
</style>