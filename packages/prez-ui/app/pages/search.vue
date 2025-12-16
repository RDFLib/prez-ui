<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
	<NuxtLayout>
		<template #breadcrumb>
			<slot name="breadcrumb">
				<ItemBreadcrumb :custom-items="[...appConfig.breadcrumbPrepend, {label: 'Search'}]" />
			</slot>
		</template>
		<template #header-text>
			Search
		</template>

		<SearchPage />
	</NuxtLayout>
</template>