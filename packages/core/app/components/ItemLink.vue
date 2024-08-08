<script lang="ts" setup>
import type { ItemLinkProps } from '../types';
const props = defineProps<ItemLinkProps>();
const url = typeof(props.to) == 'string' ? props.to : props.to?.links ? props.to?.links[0]?.value : '#';

const extLink = url.startsWith('http') || url.startsWith('mailto');
const attr = extLink ? {
    target: '_blank',
    rel: 'noopener noreferrer', class: 'inline-flex items-center hover:underline'} : {};

// If we have a nuxt environment, use the nuxt link
const navigateToLink = (event: MouseEvent, path: string) => {
    if (path.startsWith('/')) {
        event.preventDefault();
        try {
            const navigate = useNavigate();
            navigate.to(path);
        } catch (ex) {
            console.error(ex);
        }
    }
};
</script>

<template>
    <slot name="wrapper" :url="url" :title="props.title" :target="props.target" :rel="props.rel">
        <a :href="url" :title="props.title" :target="props.target" :rel="props.rel" v-bind="attr" @click="(e)=>navigateToLink(e, url)">
            <slot />
            <i v-if="extLink" class="pi pi-external-link ml-1 text-xs" />            
        </a>
    </slot>
</template>

<style scoped>
</style>