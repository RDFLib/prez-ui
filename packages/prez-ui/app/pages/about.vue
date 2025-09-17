<script lang="ts" setup>
const appConfig = useAppConfig();
</script>

<template>
    <NuxtLayout>
        <template #breadcrumb>
            <slot name="breadcrumb">
                <ItemBreadcrumb :custom-items="[...appConfig.breadcrumbPrepend, {label: 'About'}]" />
            </slot>
        </template>
        <template #header-text>
            About Prez
        </template>
        <template #default>
            <p>
                Prez is an open source Application Programming Interface (API) that implements <a
                    href="https://www.w3.org/standards/semanticweb/data">Linked Data</a>
                methods for providing access to a wide range of data on the web.</p>
            <br>
            <p>It also implements the <a
                    href="https://docs.ogc.org/is/17-069r3/17-069r3.html">OGC API:Features</a>
                for spatial data.
            </p>
            <h2 class="text-xl mt-8">Documentation</h2>
            <p>See the <a href="https://github.com/RDFLib/prez-ui" target="_blank" rel="noopener noreferrer">Prez UI GitHub</a> for
                documentation on the frontend, and the <a href="https://github.com/RDFLib/prez" target="_blank" rel="noopener noreferrer">Prez API GitHub</a> for documentation on the API.
            </p>
            <h2 class="text-xl mt-8">License</h2>
            <p>Prez is licensed using the <a href="https://github.com/rdflib/prez/blob/main/LICENSE" target="_blank"
                rel="noopener noreferrer">BSD 3-Clause licence</a>.</p>
        </template>
    </NuxtLayout>
</template>