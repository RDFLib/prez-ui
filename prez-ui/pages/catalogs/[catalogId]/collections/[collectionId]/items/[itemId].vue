<script lang="ts" setup>
import { type PrezItem, getItem, type ProfileHeader } from "prez-lib";
import ItemLayout from "~/components/ItemLayout.vue";
import ProfileTable from "~/components/ProfileTable.vue";

const config = useRuntimeConfig();
const route = useRoute();

const item = ref<PrezItem>({} as PrezItem);
const profiles = ref<ProfileHeader[]>([]);

onMounted(async () => {
    const { data, profiles: p } = await getItem(config.public.apiUrl + route.fullPath, route.params.itemId as string);
    item.value = data;
    profiles.value = p;
})
</script>

<template>
    <ProfileTable v-if="route.query?._profile === 'altr-ext:alt-profile'" :profiles="profiles" :path="route.path" />
    <ItemLayout v-else-if="item.properties" :focusNode="item.focusNode" :properties="item.properties" :profiles="profiles" :path="route.path"></ItemLayout>
</template>
