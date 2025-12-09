<script lang="ts" setup>
import { ref } from "vue";
import { Copy, Check } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { CopyButtonProps } from "@/types";
import Button from "./ui/button/Button.vue";

const props = defineProps<CopyButtonProps>();

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
	    title="Copy to clipboard"
	    @click="onClick"
	    :class="cn('copy-btn', props.class)"
	    aria-label="Copy"
	    :variant="props.variant"
	    :size="props.size"
    >
	    <Check v-if="clicked" class="w-4 h-4" />
        <Copy v-else class="w-4 h-4" />
        <template v-if="!props.iconOnly">{{ clicked ? 'Copied!' : 'Copy' }}</template>
    </Button>
</template>
