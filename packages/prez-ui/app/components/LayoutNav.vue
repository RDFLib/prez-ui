<script lang="ts" setup>
import { Cog, Book, Sun, Moon, SunMoon, Search, X, Menu } from "lucide-vue-next";
import { useWindowScroll } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const colorMode = useColorMode();
const { y: scrollY } = useWindowScroll();
const navRef = useTemplateRef("navRef");

if (!runtimeConfig.public.prezEnableDarkMode) {
	colorMode.value = "light";
}

const showDebugPanel = defineModel<boolean>();

const q = ref("");
const showSidenav = ref(false);

router.beforeEach((from, to) => {
	showSidenav.value = false;
});
</script>

<template>
    <div class="border-b sticky top-0 md:relative bg-background z-50" ref="navRef">
        <div class="container mx-auto p-2 grid grid-cols-[1fr_3fr_1fr] md:px-4 md:py-4 md:flex md:flex-row items-center justify-between gap-2">
			<!-- mobile nav-->
	        <Sheet v-model:open="showSidenav">
		        <SheetTrigger as-child>
			        <Button variant="ghost" size="icon" class="md:hidden">
				        <Menu class="size-4" />
			        </Button>
		        </SheetTrigger>
		        <SheetContent side="left" class="p-2" hideClose>
			        <SheetHeader class="grid grid-cols-[1fr_3fr_1fr] gap-2 p-2">
				        <SheetClose as-child>
					        <Button variant="ghost" size="icon">
						        <Menu class="size-4" />
					        </Button>
				        </SheetClose>
				        <NuxtLink to="/" class="flex flex-row gap-2 items-center justify-center !text-foreground !hover:no-underline">
					        <slot name="title">
						        <img src="/prez-logo.png" alt="Prez Logo" class="h-[36px]" />
						        <span class="text-xl">Prez UI</span>
					        </slot>
				        </NuxtLink>
				        <div></div>
			        </SheetHeader>
			        <nav class="main-nav flex flex-col items-center gap-2">
				        <NuxtLink
					        v-for="{ label, url } in appConfig.menu.filter(item => item.active && item.url !== '/docs')"
					        :to="url"
					        :class="`border-b-[3px] hover:border-primary transition-all ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'text-primary border-primary' : 'border-transparent'}`"
				        >
					        {{ label }}
				        </NuxtLink>
				        <hr class="w-full" />
				        <a
					        v-if="appConfig.menu.find(item => item.url === '/docs' && item.active)"
					        :href="`${runtimeConfig.public.prezApiEndpoint}/docs`"
					        class="border-b-[3px] border-transparent hover:border-primary transition-all"
				        >
					        API Docs
				        </a>
			        </nav>
		        </SheetContent>
	        </Sheet>
	        <!-- desktop nav-->
	        <nav class="main-nav hidden md:flex md:flex-row items-center gap-8">
		        <NuxtLink
			        v-for="{ label, url } in appConfig.menu.filter(item => item.active && item.url !== '/docs')"
			        :to="url"
			        :class="`border-b-[3px] hover:border-primary transition-all ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'text-primary border-primary' : 'border-transparent'}`"
		        >
			        {{ label }}
		        </NuxtLink>
	        </nav>

	        <div class="text-center md:hidden">
		        <NuxtLink to="/" :class="`flex flex-row gap-2 items-center justify-center !text-foreground !hover:no-underline transition-opacity ${!!navRef && scrollY >= navRef.offsetTop ? 'opacity-100' : 'opacity-0'}`">
			        <slot name="title">
				        <img src="/prez-logo.png" alt="Prez Logo" class="h-[36px]" />
				        <span class="text-xl">Prez UI</span>
			        </slot>
		        </NuxtLink>
	        </div>

	        <div class="flex flex-row gap-2 items-center justify-end">
		        <InputGroup class="max-w-56 hidden md:flex">
			        <InputGroupInput type="search" name="q" v-model="q" placeholder="Search..." @keyup.enter="navigateTo({path: '/search', query: {q}})" />
			        <InputGroupAddon>
				        <Search class="size-4" />
			        </InputGroupAddon>
			        <InputGroupAddon align="inline-end">
				        <InputGroupButton type="button" size="icon-sm" variant="link" class="text-muted-foreground hover:text-foreground" @click="q = ''">
					        <X class="size-4" />
				        </InputGroupButton>
			        </InputGroupAddon>
		        </InputGroup>
		        <Button variant="ghost" size="icon" class="md:hidden" asChild>
			        <NuxtLink to="/search"><Search class="size-4" /></NuxtLink>
		        </Button>

		        <Button
			        v-if="runtimeConfig.public.prezEnableDarkMode"
			        variant="ghost"
			        size="icon"
			        title="Change theme"
			        @click="!colorMode.unknown ? colorMode.value === 'dark' ? colorMode.preference = 'light' : colorMode.preference = 'dark' : undefined"
		        >
			        <SunMoon v-show="colorMode.unknown" class="size-4" />
			        <Sun v-show="colorMode.value === 'dark'" class="size-4" />
			        <Moon v-show="colorMode.value === 'light'" class="size-4" />
		        </Button>
		        <Button v-if="appConfig.menu.find(item => item.url === '/docs' && item.active)" variant="ghost" size="icon" class="hidden md:flex" title="API Docs" asChild>
			        <a :href="`${runtimeConfig.public.prezApiEndpoint}/docs`"><Book class="size-4" /></a>
		        </Button>

		        <!-- debug -->
		        <div v-if="runtimeConfig.public.prezDebug" class="!ml-auto">
			        <div v-if="showDebugPanel">
                    <span
	                    title="Toggle debug off"
	                    class="hover:cursor-pointer hover:text-gray-500 text-blue-400"
	                    @click="showDebugPanel = !showDebugPanel"
                    >
                        <Cog class="w-4 h-4" />
                    </span>
			        </div>
			        <span
				        v-else
				        title="Toggle debug on"
				        class="hover:cursor-pointer hover:text-gray-500 text-gray-300"
				        @click="showDebugPanel = !showDebugPanel"
			        >
                    <Cog class="w-4 h-4" />
                </span>
		        </div>
	        </div>
        </div>
    </div>
</template>
