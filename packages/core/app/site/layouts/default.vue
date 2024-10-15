<script setup lang="ts">
import { useGetPrezAPIAltEndpoints, useSetAPIEndpoint } from '../composables/useLib';

const props = defineProps<{sidepanel?: boolean, contentonly?: boolean}>()
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const globalConfig = useGlobalConfig();
const apiEndpoint = useGetPrezAPIEndpoint();
const altEndpoints = useGetPrezAPIAltEndpoints();
const menu = appConfig.menu;
const expanded = ref(false);
const showDebugPanel = ref(false);

onBeforeMount(() => {
  expanded.value = !!localStorage.getItem('expanded');
  showDebugPanel.value = runtimeConfig.public.prezDebug && !!localStorage.getItem('debug');
});
watch(expanded, val => localStorage.setItem('expanded', val && '1' || ''));

watch(showDebugPanel, val => localStorage.setItem('debug', val && '1' || ''));


</script>
<template>

    <div class="flex flex-col min-h-screen">

        <!-- Header -->
        <header class="bg-gray-800 text-white h-32">
            <div class="container mx-auto px-4 h-full flex justify-between items-center">
                
                <!-- Logo area -->
                <nuxt-link to="/" class="text-4xl hidden md:block">
                    <slot name="logo">Prez UI</slot>
                </nuxt-link>

                <!-- Navigation -->
                <nav class="space-x-4 text-right">
                    <nuxt-link to="/services" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">Privacy</nuxt-link>
                    <nuxt-link to="/contact" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">Contact</nuxt-link>
                </nav>

            </div>
        </header>

        <div class="border-b relative">
            <nav class="container font-extralight mx-auto px-4 py-4 hidden md:flex space-x-12 text-lg text-primary">
                <nuxt-link v-for="{label, url} in menu" :to="url" class="border-b-[5px] border-transparent hover:border-orange-500">{{ label }}</nuxt-link>
                <div v-if="runtimeConfig.public.prezDebug" class="!ml-auto">
                    <div v-if="showDebugPanel"><i title="Toggle debug off" class="hover:cursor-pointer hover:text-gray-500 pi pi-cog text-blue-400" @click="()=>{ showDebugPanel = !showDebugPanel }"></i></div>
                    <i v-else title="Toggle debug on" class="hover:cursor-pointer hover:text-gray-500 pi pi-cog text-gray-300" @click="()=>{ showDebugPanel = !showDebugPanel }"></i>
                </div>
            </nav>
        </div>

        <slot v-if="!contentonly" name="header">
            <div class="bg-gray-100">
                <div class="container mx-auto flex flex-row">
                    <div class="px-4 py-4 flex-grow">
                        <slot name="breadcrumb" />
                        <div class="text-3xl pb-7">
                            <slot name="header-text" />
                        </div>
                    </div>
                    <div v-if="showDebugPanel" class="m-2 bg-gray-200 rounded-lg text-[12px] leading-[12px]">
                        <slot name="debug" />
                    </div>
                </div>
            </div>
        </slot>
        <div v-else-if="showDebugPanel" class="bg-gray-100">
            <div class="container px-4 py-4 mx-auto">
                <slot name="debug" />
            </div>
        </div>

        <div class="container mx-auto flex-grow">

            <div v-if="sidepanel" class="grid grid-cols-4 gap-4 px-4 py-4">
                <div :class="!expanded ? 'col-span-3 ... relative' : 'col-span-4 relative'">
                    <slot />
                    <div class="absolute right-0 top-[-5px] pointer-events-auto" @click="()=>{ expanded = !expanded }">
                        <i v-if="expanded" title="Show sidepanel" class="pi pi-angle-double-right text-xs p-[4px] hover:cursor-pointer hover:bg-gray-200 hover:rounded-full" />
                    </div>
                </div>
                <div v-if="!expanded" class="... relative">
                    <slot name="sidepanel"></slot>
                    <div class="absolute right-0 top-[-5px] pointer-events-auto" @click="()=>{ expanded = !expanded }">
                        <i v-if="!expanded" title="Expand and hide sidepanel" class="pi pi-angle-double-left text-xs p-[4px] hover:cursor-pointer hover:bg-gray-200 hover:rounded-full" />
                    </div>
                </div>
            </div>
            <div v-else class="px-4 py-4">
                <slot />
            </div>

        </div>

        <footer class="bg-gray-800 text-white pt-6 pb-10">
            <div class="container mx-auto text-center">
                <p>about your organisation</p>
                <small v-if="globalConfig?.version">Prez Version - <a :href="apiEndpoint" target="_new">API {{ globalConfig?.version }}</a></small>
                <div v-if="apiEndpoint != runtimeConfig.public.prezApiEndpoint && !altEndpoints.find(e=>e.endpoint == apiEndpoint)">
                    <em><small>custom override API endpoint {{ apiEndpoint }}</small></em>
                </div>
                <ul v-if="altEndpoints" class="flex space-x-1 text-sm text-gray-400 justify-center [&>li:not(:last-child)]:after:content-['|'] [&>li:not(:last-child)]:after:mx-2">
                    <li class="hover:cursor-pointer" v-for="({endpoint, name}) of [{name: 'Default', endpoint: runtimeConfig.public.prezApiEndpoint}, ...altEndpoints]">
                        <a :class="apiEndpoint == endpoint ? '!text-yellow-200' : ''" :href="`/?_api=${endpoint}`">{{ name }}</a>
                    </li>
                </ul>
            </div>
        </footer>

    </div>
</template>
