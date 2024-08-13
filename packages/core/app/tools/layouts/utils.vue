<script setup lang="ts">
const props = defineProps<{sidepanel?: boolean, contentonly?: boolean}>()
const appConfig = useAppConfig().prez;
const menu = appConfig.utilsMenu;
</script>
<template>
    <div class="flex flex-col min-h-screen">

        <!-- Header -->
        <header class="bg-red-800 text-white h-16">
            <div class="container mx-auto px-4 h-full flex justify-between items-center">
                
                <!-- Logo -->
                <nuxt-link to="/_prez" class="text-2xl">prez-ui utilities</nuxt-link>

                <!-- Navigation -->
                <nav class="space-x-4">
                    <nuxt-link v-for="{label, url} in menu" :to="url" class="hover:text-gray-400 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bg-orange-500 after:bottom-0 after:left-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100">
                        {{ label }}
                    </nuxt-link>
                </nav>

            </div>
        </header>

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
