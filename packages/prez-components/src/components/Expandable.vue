<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExpandableProps } from "@/types";

const props = defineProps<ExpandableProps>();

const wrapper = useTemplateRef("wrapper");

const expanded = ref(false);
const heightExceeded = computed(() => {
	if (wrapper.value && wrapper.value.clientHeight && wrapper.value.scrollHeight) {
		return wrapper.value.clientHeight < wrapper.value.scrollHeight;
	} else return false;
});
</script>

<template>
	<div :class="cn('', props.class)">
		<div ref="wrapper" :class="`${expanded ? 'line-clamp-none' : 'line-clamp-5'}`">
			<slot />
		</div>
		<Button v-if="heightExceeded" variant="link" class="float-right text-muted-foreground hover:text-foreground" @click="expanded = !expanded">{{expanded ? 'less' : 'more'}}</Button>
	</div>
</template>
