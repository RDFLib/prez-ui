<script setup lang="ts">
import { TestButton, type ButtonProps } from "prez-components";

const props = defineProps<ButtonProps>();
</script>

<template>
    <TestButton v-bind="props">Overridden <slot></slot></TestButton>
</template>