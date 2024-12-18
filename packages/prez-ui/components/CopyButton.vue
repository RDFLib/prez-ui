<script lang="ts" setup>
import { CopyButton, type CopyButtonProps } from "prez-components-test";

const props = defineProps<CopyButtonProps>();
</script>

<template>
    <CopyButton v-bind="props" />
</template>
