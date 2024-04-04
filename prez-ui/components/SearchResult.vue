<script lang="ts" setup>
import { PrezUINode } from "prez-components";
import type { PrezSearchResult } from "prez-lib";

const props = defineProps<PrezSearchResult>();
</script>

<template>
    <div class="result">
        <PrezUINode v-bind="props.resource.focusNode" :showDesc="false" />
        <em v-if="props.resource.focusNode.description">{{ props.resource.focusNode.description.value }}</em>
    </div>
</template>

<style lang="scss" scoped>
.result {
    background-color: #fafafa;
    padding: 12px;
    border-radius: 4px;
}
</style>