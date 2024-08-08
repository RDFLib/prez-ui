<script lang="ts" setup>
import type { LoadingProps } from '../types';
const props = defineProps<LoadingProps>();
</script>
<template>
    <div v-if="props.variant == 'list'">
        <Skeleton height="2rem" width="20rem" class="mb-2" style="margin-bottom: 20px"/>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 8px"/>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 8px"/>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 8px"/>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 12px"/>
    </div>
    <div v-else-if="props.variant == 'search'">
        <Skeleton height="2rem" width="12rem" class="mb-2" style="margin-bottom: 20px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"/>
    </div>
    <div v-else-if="props.variant == 'concept'">
        <ProgressSpinner 
            style="width: 20px; height: 20px" 
            stroke-width="4"
            fill="transparent"
            animation-duration="1s" 
            aria-label="Loading concepts" />
    </div>
    <div v-else>
        <Skeleton height="2rem" width="12rem" class="mb-2" style="margin-bottom: 20px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 8px"/>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="20rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="10rem" class="mb-2" style="margin-bottom: 12px"/>
        <Skeleton width="30rem" class="mb-2"/>
    </div>

</template>
