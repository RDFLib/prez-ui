<script lang="ts" setup>
import { Loading, type LoadingProps } from "prez-components";

const props = defineProps<LoadingProps>();
</script>

<template>
    <Loading v-bind="props" />
</template>
