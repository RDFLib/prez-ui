<script lang="ts" setup>
import { useGetItem } from "~/composables/api";
import { ALT_PROFILE_TOKEN } from "~/util/consts";

const config = useRuntimeConfig();
const route = useRoute();
const { data, pending, error } = await useGetItem(config.public.apiUrl + route.fullPath, route.path.split("/").slice(-1)[0]);
</script>

<template>
    <ProfileTable v-if="route.query?._profile === ALT_PROFILE_TOKEN" :profiles="data.profiles" :path="route.path" />
    <ItemLayout v-else :data="data.data" :profiles="data.profiles" :path="route.path" :loading="pending" :error="error">
        <slot></slot>
    </ItemLayout>
</template>
