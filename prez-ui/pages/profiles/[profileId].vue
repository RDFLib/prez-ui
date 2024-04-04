<script lang="ts" setup>
import { type PrezItem, getItem, type ProfileHeader } from "prez-lib";
import ItemLayout from "~/components/ItemLayout.vue";
import ProfileTable from "~/components/ProfileTable.vue";

const config = useRuntimeConfig();

const profile = ref<PrezItem>({} as PrezItem);
const profiles = ref<ProfileHeader[]>([]);

const route = useRoute();

onMounted(async () => {
    const { data, profiles: p } = await getItem(config.public.apiUrl + route.fullPath, route.params.profileId as string);
    profile.value = data;
    profiles.value = p;
})
</script>

<template>
    <ProfileTable v-if="route.query?._profile === 'altr-ext:alt-profile'" :profiles="profiles" :path="route.path" />
    <ItemLayout v-else-if="profile.properties" :focusNode="profile.focusNode" :properties="profile.properties" :profiles="profiles" :path="route.path"></ItemLayout>
</template>
