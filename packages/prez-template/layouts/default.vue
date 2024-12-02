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
        <header class="bg-gray-600 text-white h-32">
            <div class="container mx-auto px-4 h-full flex justify-between items-center">
                
                <!-- Logo area -->
                <NuxtLink to="/" class="text-4xl hidden md:block">
                    <slot name="logo">Themed Prez UI</slot>
                </NuxtLink>

                <!-- Navigation -->
                <nav class="space-x-4 text-right">
                    <a href="http://" target="_blank" rel="noopener noreferrer">Link</a>
                </nav>

            </div>
        </header>

        <div class="border-b relative">
            <nav class="container font-extralight mx-auto px-4 py-4 hidden md:flex space-x-12 text-lg">
                <NuxtLink
                    v-for="{ label, url } in menu.filter(item => item.active !== false)"
                    :to="url"
                    :class="`border-b-[5px] hover:border-primary ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'text-primary border-primary' : 'border-transparent'}`"
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
            <div class="bg-gray-100">
                <div class="container mx-auto flex flex-row">
                    <div class="px-4 py-4 flex-grow">
                        <slot name="breadcrumb" />
                        <div class="text-3xl pb-4 pt-3">
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

        <footer class="bg-gray-600 text-white pt-6 pb-10">
            <div class="container mx-auto text-center">
                <p>This is my custom Prez UI v4 theme</p>
            </div>
        </footer>
    </div>
</template>
