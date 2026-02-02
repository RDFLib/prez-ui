<script setup lang="ts">
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PrezTooltipProps } from "@/types";
import Literal from "@/components/Literal.vue";
import {literal} from "prez-lib";

const props = defineProps<PrezTooltipProps>();
</script>

<template>
	<TooltipProvider :delayDuration="200">
		<Tooltip>
			<TooltipTrigger>
				<slot />
			</TooltipTrigger>
			<TooltipContent v-if="props.tooltip" :class="cn('max-w-md line-clamp-3 overflow-hidden overflow-ellipsis', props.class)">
				<Literal :term="typeof props.tooltip === 'string' ? literal(props.tooltip) : props.tooltip" renderHtml renderMarkdown hideDataType hideLanguage />
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</template>
