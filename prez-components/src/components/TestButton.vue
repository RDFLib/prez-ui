<script lang="ts" setup>
import { ButtonProps } from "../types";

const props = defineProps<ButtonProps>();
</script>

<template>
    <button :class="`btn ${props.color} ${props.size}`">
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
button.btn {
    background-color: #f3f3f3;
    font-size: 14px;
    border: none;
    padding: 6px 8px;
    border-radius: 0.25rem;
    cursor: pointer;

    &.primary {
        background-color: #3f3ff1;
        color: white;
    }

    &.secondary {
        background-color: #adadad;
    }

    &.sm {
        font-size: 12px;
        padding: 4px 6px;
    }

    &.lg {
        font-size: 16px;
        padding: 8px 10px;
    }
}
</style>