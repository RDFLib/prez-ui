<script setup lang="ts">
import { ChevronRight, ChevronLeft } from "lucide-vue-next";

const props = defineProps<{
    sidepanel?: boolean;
    contentonly?: boolean;
}>();
const runtimeConfig = useRuntimeConfig();
const globalConfig = useGlobalConfig(); // needed for checking if SPARQL is enabled
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
    <div class="flex flex-col min-h-screen relative">
        <LayoutHeader />

        <LayoutNav v-model="showDebugPanel" />

        <!-- page heading -->
        <slot v-if="!props.contentonly" name="header">
            <div class="bg-muted dark:bg-muted/50">
                <div class="container mx-auto flex flex-row relative">
                    <div class="px-4 py-4 flex-grow">
                        <slot name="breadcrumb" />
                        <h1 class="text-3xl pb-4 pt-3">
                            <slot name="header-text" />
                        </h1>
                    </div>

	                <Sheet v-if="props.sidepanel">
		                <SheetTrigger as-child>
			                <Button variant="outline" size="icon" class="absolute right-2 bottom-2 lg:hidden" title="Show sidepanel">
				                <ChevronLeft class="size-4" />
			                </Button>
		                </SheetTrigger>
		                <SheetContent side="right" class="p-2" hideClose>
			                <SheetHeader class="grid grid-cols-[1fr_3fr_1fr] gap-2 p-2">
				                <SheetClose as-child>
					                <Button variant="ghost" size="icon">
						                <ChevronRight class="size-4" />
					                </Button>
				                </SheetClose>
				                <div></div>
				                <div></div>
			                </SheetHeader>
			                <slot name="sidepanel" />
		                </SheetContent>
	                </Sheet>
	                <Button
		                v-if="props.sidepanel"
	                    variant="outline"
	                    size="icon"
	                    class="absolute right-2 bottom-2 hidden lg:flex"
	                    :title="`${expandSidePanel ? 'Hide sidepanel' : 'Show sidepanel'}`"
	                    @click="expandSidePanel = !expandSidePanel"
	                >
		                <ChevronRight v-if="expandSidePanel" class="size-4" />
		                <ChevronLeft v-else class="size-4" />
	                </Button>
                    
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
            <div :class="`${props.sidepanel ? 'flex flex-row gap-4' : ''} p-4`">
                <div class="grow">
                    <slot />
                </div>
                <div v-if="props.sidepanel" :class="`lg:max-w-[350px] lg:transition-[width] lg:overflow-hidden hidden lg:shrink-0 lg:relative lg:flex ${expandSidePanel ? 'lg:w-1/4' : 'lg:w-0'}`">
                    <slot name="sidepanel" />
                </div>
            </div>
        </div>

        <LayoutFooter />
    </div>
</template>
