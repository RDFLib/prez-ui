<script setup lang="ts">
import { ChevronRight, ChevronLeft } from "lucide-vue-next";

const props = defineProps<{
    sidepanel?: boolean;
    contentonly?: boolean;
}>();
const runtimeConfig = useRuntimeConfig();
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
        <LayoutHeader />

        <LayoutNav v-model="showDebugPanel" />

        <!-- page heading -->
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

        <!-- content -->
        <div class="container mx-auto flex-grow">
            <div v-if="sidepanel" class="grid grid-cols-4 gap-4 px-4 py-4">
                <div :class="expandSidePanel ? 'col-span-3 relative' : 'col-span-4 relative'">
                    <slot />
                    <Button
                        v-if="!expandSidePanel"
                        title="Show sidepanel"
                        variant="ghost"
                        size="icon"
                        class="absolute right-0 top-[-5px] pointer-events-auto"
                        @click="expandSidePanel = !expandSidePanel"
                    >
                        <ChevronLeft class="size-4" />
                    </Button>
                </div>
                <div v-if="expandSidePanel" class="relative">
                    <slot name="sidepanel" />
                    <Button
                        title="Hide sidepanel"
                        variant="ghost"
                        size="icon"
                        class="absolute right-0 top-[-5px] pointer-events-auto"
                        @click="expandSidePanel = !expandSidePanel"
                    >
                        <ChevronRight class="size-4" />
                    </Button>
                </div>
            </div>
            <div v-else class="px-4 py-4">
                <slot />
            </div>
        </div>

        <LayoutFooter />
    </div>
</template>
