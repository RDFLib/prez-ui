<script lang="ts" setup>
import { Message, type MessageProps } from "prez-components-test";

const props = defineProps<MessageProps>();
</script>

<template>
    <Message v-bind="props" />
</template>
