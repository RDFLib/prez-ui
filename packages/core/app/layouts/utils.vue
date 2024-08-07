<script setup lang="ts">
const props = defineProps<{sidepanel?: boolean, contentonly?: boolean}>()
const appConfig = useAppConfig();
const menu = appConfig.utilsMenu;
</script>
<template>
    <div class="flex flex-col min-h-screen">

        <!-- Header -->
        <header class="bg-red-800 text-white h-16">
            <div class="container mx-auto px-4 h-full flex justify-between items-center">
                
                <!-- Logo -->
                <nuxt-link to="/" class="text-2xl">prez-ui utilities</nuxt-link>

                <!-- Navigation -->
                <nav class="space-x-4">
                    <nuxt-link to="/_utils/lib" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">lib</nuxt-link>
                    <nuxt-link to="/_utls/showcase" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">showcase</nuxt-link>
                    <nuxt-link to="/_utils/admin" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">admin</nuxt-link>
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
                    <div class="text-2xl pb-7">
                        <slot name="header-text" />
                    </div>
                </div>
            </div>
        </slot> 

        <div class="container mx-auto flex-grow">

            <div v-if="sidepanel" class="grid grid-cols-5 gap-4 px-4 py-4">
                <div class="col-span-4 ...">
                    <slot />
                </div>
                <div class="...">
                    <slot name="sidepanel"></slot>
                </div>
            </div>
            <div v-else class="px-4 py-4">
                <slot />
            </div>

        </div>

        <footer class="bg-gray-800 text-white py-4">
            <div class="container mx-auto text-center">
                <p>turn off utility pages?</p>
            </div>
        </footer>

    </div>
  </template>
