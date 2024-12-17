<script lang="ts" setup>
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingProps } from "@/types";

const props = defineProps<LoadingProps>();
</script>

<template>
    <!-- Loading -->
    <div v-if="props.variant == 'list'">
        <div class="p-4 border-b">
            <Skeleton class="h-4 w-16" />
        </div>
        <div v-for="i in [...Array(4).keys()]" :class="`p-4 ${i < 3 ? 'border-b' : ''}`">
            <Skeleton class="h-4 w-[250px]" />
        </div>
    </div>
    <div v-else-if="props.variant == 'search'">
        <div v-for="i in [...Array(4).keys()]" :class="`p-4 flex flex-col gap-2 ${i < 3 ? 'border-b' : ''}`">
            <div class="flex flex-row justify-between items-center">
                <Skeleton class="h-4 w-44" />
                <Skeleton class="h-4 w-24" />
            </div>
            <Skeleton class="h-4 w-[400px]" />
        </div>
    </div>
    <div v-else-if="props.variant == 'concept'" class="space-y-4">
        <Skeleton v-for="i in [...Array(6).keys()]" class="h-4 w-44" :key="i" />
    </div>
    <div v-else-if="props.variant == 'item'">
        <div class="space-y-4">
            <Skeleton class="h-4 w-[300px]" />
            <Skeleton class="h-4 w-[200px]" />
        </div>
        <div v-for="i in [...Array(4).keys()]" :class="`p-4 flex flex-row gap-4 mt-4 ${i < 3 ? 'border-b' : ''}`">
            <Skeleton class="h-4 w-28" />
            <Skeleton class="h-4 w-48" />
        </div>
    </div>
    <div v-else>
        <hr v-if="props.variant == 'item-table'" class="mb-4 mt-8" >
        <div class="space-y-4">
            <Skeleton class="h-4 w-[300px]" />
            <Skeleton class="h-4 w-[200px]" />
        </div>
        <div v-for="i in [...Array(4).keys()]" :class="`p-4 flex flex-row gap-4 mt-4 ${i < 3 ? 'border-b' : ''}`">
            <Skeleton class="h-4 w-28" />
            <Skeleton class="h-4 w-48" />
        </div>
    </div>
</template>
