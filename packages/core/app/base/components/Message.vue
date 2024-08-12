<script lang="ts" setup>
import type { MessageProps } from '../types';
import PVMessage from 'primevue/message';

const props = defineProps<MessageProps>();
</script>

<template>
    <PVMessage :severity="props.severity">{{ props.text }}</PVMessage>
</template>
