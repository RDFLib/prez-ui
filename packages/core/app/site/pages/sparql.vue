<script lang="ts" setup>
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";

const apiEndpoint = useGetPrezAPIEndpoint();
const appConfig = useAppConfig();

onMounted(() => {
    const yasgui = new Yasgui(document.getElementById("yasgui")!, {
        requestConfig: {
            endpoint: `${apiEndpoint}/sparql`,
            method: "POST"
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
<style lang="scss" scoped>
.yasgui {
    .autocompleteWrapper { // disable endpoint selector
        display: none !important;
    }
}
</style>