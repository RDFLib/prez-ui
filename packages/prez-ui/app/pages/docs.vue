<script lang="ts" setup>
const apiEndpoint = useGetPrezAPIEndpoint();
const appConfig = useAppConfig();
</script>
<template>  
    <NuxtLayout>
        <template #breadcrumb>
            <slot name="breadcrumb">
                    <ItemBreadcrumb :custom-items="[...appConfig.breadcrumbPrepend, {label: 'API Documentation'}]" />
            </slot>
        </template>
        <template #header-text>
            API Documentation
        </template>

        <template #default>
            <iframe :src="`${apiEndpoint}/docs`" class="min-h-[800px] w-[100%] h-[100%] mt-4" frameborder="0" name="docs" title="Prez API Swagger Docs" data-v-d64e4bad=""></iframe>
        </template>
    </NuxtLayout>
</template>