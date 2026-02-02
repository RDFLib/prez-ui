<script setup lang="ts">
import { CircleAlert } from "lucide-vue-next";
import type { NuxtError } from '#app'

const props = defineProps({
	error: Object as () => NuxtError,
});
</script>

<template>
	<NuxtLayout>
		<div>
			<Alert variant="destructive" class="border-destructive">
				<CircleAlert />
				<AlertTitle>
					{{props.error?.statusMessage || "Error"}}
				</AlertTitle>
				<AlertDescription>
					{{props.error?.message}}
				</AlertDescription>
			</Alert>
		</div>
		<NuxtLink to="/">Go home</NuxtLink>
	</NuxtLayout>
</template>
