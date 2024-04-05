<script lang="ts" setup>
import { PrezUINode } from "prez-components";
import type { PrezSearchResult } from "prez-lib";
import Skeleton from "primevue/skeleton";

const props = defineProps<{
    loading?: boolean;
    data?: PrezSearchResult;
}>();
</script>

<template>
    <div class="result">
        <template v-if="props.loading">
            <Skeleton height="1.5rem" width="12rem" class="mb-2"></Skeleton>
            <Skeleton width="30rem" class="mb-2"></Skeleton>
        </template>
        <template v-else-if="props.data">
            <PrezUINode v-bind="props.data.resource.focusNode" :showDesc="false" />
            <em v-if="props.data.resource.focusNode.description">{{ props.data.resource.focusNode.description.value }}</em>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.result {
    background-color: #fafafa;
    padding: 12px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>