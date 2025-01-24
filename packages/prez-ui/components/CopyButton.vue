<script lang="ts" setup>
import { CopyButton, type CopyButtonProps } from "prez-components";

const props = defineProps<CopyButtonProps>();
</script>

<template>
    <CopyButton v-bind="props" />
</template>
