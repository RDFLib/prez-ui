<script lang="ts" setup>
import { PrezUILoadingProps } from '@/types';
import Skeleton from 'primevue/skeleton';
const props = defineProps<PrezUILoadingProps>();
</script>
<template>
    <div v-if="props.variant == 'list'">
        <Skeleton height="2rem" width="20rem" class="mb-2" style="margin-bottom: 20px"></Skeleton>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 8px"></Skeleton>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 8px"></Skeleton>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 8px"></Skeleton>
        <Skeleton width="50rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
    </div>
    <div v-else-if="props.variant == 'search'">
        <Skeleton height="2rem" width="12rem" class="mb-2" style="margin-bottom: 20px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
    </div>
    <div v-else="props.variant == 'item'">
        <Skeleton height="2rem" width="12rem" class="mb-2" style="margin-bottom: 20px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 8px"></Skeleton>
        <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="20rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="10rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
        <Skeleton width="30rem" class="mb-2"></Skeleton>
    </div>

</template>
