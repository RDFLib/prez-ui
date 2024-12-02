<script lang="ts" setup>
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";

const apiEndpoint = useGetPrezAPIEndpoint();
const appConfig = useAppConfig();

onMounted(() => {
    const yasgui = new Yasgui(document.getElementById("yasgui")!, {
        requestConfig: {
            endpoint: `${apiEndpoint}/sparql`,
            method: "GET"
        },
        copyEndpointOnNewTab: true,
        autofocus: true
    });
});
</script>

<template>  
    <NuxtLayout>
        <template #breadcrumb>
            <slot name="breadcrumb">
                <ItemBreadcrumb :custom-items="[...appConfig.breadcrumbPrepend, {label: 'SPARQL'}]" />
            </slot>
        </template>
        <template #header-text>
            SPARQL Editor
        </template>

        <template #default>

            <div class="mb-8" id="yasgui"></div>

        </template>
    </NuxtLayout>
</template>

<style scoped>
/** disable endpoint selector */
.yasgui .autocompleteWrapper {
    display: none !important;
}
</style>