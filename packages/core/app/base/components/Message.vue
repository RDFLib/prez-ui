<script lang="ts" setup>

interface Props {
    severity?: "info" | "error";
    text?: string;
};

const props = defineProps<Props>();
</script>

<template>
    <!-- Message -->
    <div>Message: {{ props.text }}</div>
</template>
