<script lang="ts" setup>
import { ref } from "vue";
import Button from "primevue/button";

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
    <Button
        :icon="`pi pi-${clicked ? 'check' : 'copy'}`"
        size="small"
        v-tooltip.top="'Copy to clipboard'"
        @click="onClick"
        :label="!props.iconOnly ? (clicked ? 'Copied' : 'Copy') : undefined"
        aria-label="Copy"
    />
</template>

<style lang="scss" scoped>

</style>