<script lang="ts" setup>
import type { PrezUIMessageProps } from '../types';
import Message from 'primevue/message';

const props = defineProps<PrezUIMessageProps>();
</script>

<template>
    <Message :severity="props.severity">{{ props.text }}</Message>
</template>
