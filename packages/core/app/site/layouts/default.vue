<script setup lang="ts">
const props = defineProps<{sidepanel?: boolean, contentonly?: boolean}>()
const appConfig = useAppConfig();
const menu = appConfig.menu;
const expanded = ref(false);
onBeforeMount(() => {
  expanded.value = !!localStorage.getItem('expanded');
});
watch(expanded, val => localStorage.setItem('expanded', val && '1' || ''));

</script>
<template>

    <div class="flex flex-col min-h-screen">

        <!-- Header -->
        <header class="bg-gray-800 text-white h-32">
            <div class="container mx-auto px-4 h-full flex justify-between items-center">
                
                <!-- Logo area -->
                <nuxt-link to="/" class="text-4xl hidden md:block">
                    Prez Documentation
                </nuxt-link>

                <!-- Navigation -->
                <nav class="space-x-4 text-right">
                    <nuxt-link to="/services" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">Privacy</nuxt-link>
                    <nuxt-link to="/contact" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">Contact</nuxt-link>
                </nav>

            </div>
        </header>

        <div class="border-b">
            <nav class="container font-extralight mx-auto px-4 py-4 hidden md:flex space-x-12 text-lg text-primary">
                <nuxt-link v-for="{label, url} in menu" :to="url" class="border-b-[5px] border-transparent hover:border-orange-500">{{ label }}</nuxt-link>
            </nav>
        </div>

        <slot v-if="!contentonly" name="header">
            <div class="bg-gray-100">
                <div class="container px-4 py-4 mx-auto">
                    <slot name="breadcrumb" />
                    <div class="text-3xl pb-7">
                        <slot name="header-text" />
                    </div>
                </div>
            </div>
        </slot> 

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

        <footer class="bg-gray-800 text-white py-4">
            <div class="container mx-auto text-center">
                <p>about your organisation</p>
            </div>
        </footer>

    </div>
  </template>
