<script setup lang="ts">
import { type PrezUILinkProps } from '../../../prez-components/app/types';
import PrezUILink from '../../../prez-components/app/components/PrezUILink.vue';
const props = defineProps<PrezUILinkProps>()

</script>
<template>
    <PrezUILink :to="props">
        <template #default="slotProps">
            <NuxtLink :to="slotProps.url" >
                <slot />
            </NuxtLink>
        </template>
    </PrezUILink>
</template>