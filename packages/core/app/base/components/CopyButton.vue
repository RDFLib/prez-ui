<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
    value: string;
    iconOnly?: boolean;
}>();

var timeout: number | NodeJS.Timeout;
const DURATION = 5000; // ms
const clicked = ref(false);

function onClick() {
    navigator.clipboard.writeText(props.value.trim());
    clearTimeout(timeout);
    clicked.value = true;
    timeout = setTimeout(() => {
        clicked.value = false;
    }, DURATION);
}
</script>

<template>
    <!-- CopyButton -->
    <button
        title="'Copy to clipboard'"
        @click="onClick"
        aria-label="Copy"
    >{{ !props.iconOnly ? (clicked ? 'Copied' : 'Copy') : 'copy icon' }}</button>
</template>
