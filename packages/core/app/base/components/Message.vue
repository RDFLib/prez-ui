<script lang="ts" setup>
import PVMessage from 'primevue/message';

interface Props {
    severity?: "info" | "error";
    text?: string;
};

const props = defineProps<Props>();
</script>

<template>
    <PVMessage :severity="props.severity">{{ props.text }}</PVMessage>
</template>
