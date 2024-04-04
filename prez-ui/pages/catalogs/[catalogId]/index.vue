<script lang="ts" setup>
import { type PrezItem, getItem, type ProfileHeader } from "prez-lib";
import ItemLayout from "~/components/ItemLayout.vue";
import ProfileTable from "~/components/ProfileTable.vue";

const config = useRuntimeConfig();
const route = useRoute();

const catalog = ref<PrezItem>({} as PrezItem);
const profiles = ref<ProfileHeader[]>([]);


onMounted(async () => {
    const { data, profiles: p } = await getItem(config.public.apiUrl + route.fullPath, route.params.catalogId as string);
    catalog.value = data;
    profiles.value = p;
})
</script>

<template>
    <ProfileTable v-if="route.query?._profile === 'altr-ext:alt-profile'" :profiles="profiles" :path="route.path" />
    <ItemLayout v-else-if="catalog.properties" :focusNode="catalog.focusNode" :properties="catalog.properties" :profiles="profiles" :path="route.path"></ItemLayout>
</template>
