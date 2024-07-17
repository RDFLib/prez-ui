<script lang="ts" setup>
import PrezUIMessage from '../../components/PrezUIMessage.vue';
import { PrezUIMessageProps } from '../../types';
const props = defineProps<PrezUIMessageProps>();
import Message from 'primevue/message';
</script>

<template>
        <PrezUIMessage v-bind="props" notheme>
        <template #text><Message :severity="props.severity">{{ props.text }}</Message></template>
    </PrezUIMessage>
</template>
