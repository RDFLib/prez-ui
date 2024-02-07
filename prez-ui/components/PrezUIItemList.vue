<script lang="ts" setup>
import { PrezUIItemList, type PrezUIItemListProps } from "prez-components";

const props = defineProps<PrezUIItemListProps>();
</script>

<template>
    <PrezUIItemList v-bind="props" />
</template>