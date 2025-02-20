<script setup lang="ts">
import { Cog, ChevronRight, ChevronLeft } from "lucide-vue-next";

const props = defineProps<{sidepanel?: boolean, contentonly?: boolean}>()
const route = useRoute();
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const globalConfig = useGlobalConfig();
const apiEndpoint = useGetPrezAPIEndpoint();
const altEndpoints = useGetPrezAPIAltEndpoints();
const menu = appConfig.menu;
const expandSidePanel = ref(false);
const showDebugPanel = ref(false);

onBeforeMount(() => {
    if (typeof localStorage !== 'undefined') {
        expandSidePanel.value = !!localStorage.getItem('expandSidePanel');
        showDebugPanel.value = runtimeConfig.public.prezDebug && !!localStorage.getItem('debug');
        watch(expandSidePanel, val => localStorage.setItem('expandSidePanel', val && '1' || ''));
        watch(showDebugPanel, val => localStorage.setItem('debug', val && '1' || ''));
    }
});
</script>

<template>
    <div class="flex flex-col min-h-screen">

        <!-- Header -->
        <header class="bg-tertiary text-secondary-foreground h-32">
            <div class="container mx-auto px-4 h-full flex justify-between items-center">
                
                <!-- Logo area -->
                <NuxtLink to="/" class="text-4xl hidden md:block">
                    <slot name="logo">
                        <div class="flex flex-row gap-3 items-center">
                            <img src="/prez-logo.png" alt="Prez logo" class="w-[60px]">
                            <span>Prez UI</span>
                        </div>
                    </slot>
                </NuxtLink>

                <!-- header nav -->

            </div>
        </header>

        <!-- main nav -->
        <div class="border-b relative">
            <nav class="main-nav container font-extralight mx-auto px-4 py-4 hidden md:flex md:flex-row gap-8 text-lg">
                <NuxtLink
                    v-for="{ label, url } in menu.filter(item => item.active !== false)"
                    :to="url"
                    :class="`border-b-[3px] hover:border-primary transition-all ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'text-primary border-primary' : 'border-transparent'}`"
                >{{ label }}</NuxtLink>

                <div v-if="runtimeConfig.public.prezDebug" class="!ml-auto">
                    <div v-if="showDebugPanel">
                        <span title="Toggle debug off" class="hover:cursor-pointer hover:text-gray-500 text-blue-400" @click="()=>{ showDebugPanel = !showDebugPanel }"><Cog class="w-4 h-4" /></span>
                    </div>
                    <span v-else title="Toggle debug on" class="hover:cursor-pointer hover:text-gray-500 text-gray-300" @click="()=>{ showDebugPanel = !showDebugPanel }"><Cog class="w-4 h-4" /></span>
                </div>
            </nav>
        </div>

        <slot v-if="!contentonly" name="header">
            <div class="bg-muted">
                <div class="container mx-auto flex flex-row">
                    <div class="px-4 py-4 flex-grow">
                        <slot name="breadcrumb" />
                        <h1 class="text-3xl pb-4 pt-3">
                            <slot name="header-text" />
                        </h1>
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
                <div :class="expandSidePanel ? 'col-span-3 relative' : 'col-span-4 relative'">
                    <slot />
                    <Button v-if="!expandSidePanel" title="Show sidepanel" variant="ghost" size="icon" class="absolute right-0 top-[-5px] pointer-events-auto" @click="expandSidePanel = !expandSidePanel">
                        <ChevronLeft class="size-4" />
                    </Button>
                </div>
                <div v-if="expandSidePanel" class="relative">
                    <slot name="sidepanel" />
                    <Button title="Hide sidepanel" variant="ghost" size="icon" class="absolute right-0 top-[-5px] pointer-events-auto" @click="expandSidePanel = !expandSidePanel">
                        <ChevronRight class="size-4" />
                    </Button>
                </div>
            </div>
            <div v-else class="px-4 py-4">
                <slot />
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-tertiary text-secondary-foreground pt-6 pb-10">
            <div class="container mx-auto text-center">
                <div class="text-sm">
                    <div>Prez UI v{{ runtimeConfig.app.version }} - <a href="https://github.com/RDFLib/prez-ui" target="_blank" rel="noopener noreferrer">GitHub</a></div>
                    <div v-if="globalConfig?.version">Prez API v{{ globalConfig?.version }} - <a href="https://github.com/RDFLib/prez" target="_blank" rel="noopener noreferrer">GitHub</a></div>
                </div>

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
    </div>
</template>
