<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const globalConfig = useGlobalConfig();
const apiEndpoint = useGetPrezAPIEndpoint();
const altEndpoints = useGetPrezAPIAltEndpoints();
</script>

<template>
    <footer class="bg-tertiary text-tertiary-foreground pt-6 pb-10">
        <div class="container mx-auto text-center">
            <div class="text-sm">
                <div>
                    Prez UI v{{ runtimeConfig.app.version }} - <a href="https://github.com/RDFLib/prez-ui" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <div v-if="globalConfig?.version">
                    Prez API v{{ globalConfig?.version }} - <a href="https://github.com/RDFLib/prez" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
            </div>

            <!-- endpoints -->
            <div v-if="apiEndpoint != runtimeConfig.public.prezApiEndpoint && !altEndpoints.find(e => e.endpoint == apiEndpoint)">
                <em><small>custom override API endpoint {{ apiEndpoint }}</small></em>
            </div>
            <ul v-if="altEndpoints.length > 0" class="flex space-x-1 text-sm text-gray-400 justify-center [&>li:not(:last-child)]:after:content-['|'] [&>li:not(:last-child)]:after:mx-2">
                <li class="hover:cursor-pointer" v-for="({endpoint, name}) of [{name: 'Default', endpoint: runtimeConfig.public.prezApiEndpoint}, ...altEndpoints]">
                    <a :class="apiEndpoint == endpoint ? '!text-yellow-200' : ''" :href="`/?_api=${endpoint}`">{{ name }}</a>
                </li>
            </ul>
        </div>
    </footer>
</template>
