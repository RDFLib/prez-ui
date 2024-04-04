<script lang="ts" setup>
import { type PrezItem, getItem, type ProfileHeader } from "prez-lib";
import ItemLayout from "~/components/ItemLayout.vue";
import ProfileTable from "~/components/ProfileTable.vue";

const config = useRuntimeConfig();
const route = useRoute();

const collection = ref<PrezItem>({} as PrezItem);
const profiles = ref<ProfileHeader[]>([]);


onMounted(async () => {
    const { data, profiles: p } = await getItem(config.public.apiUrl + route.fullPath, route.params.collectionId as string);
    collection.value = data;
    profiles.value = p;
})
</script>

<template>
    <ProfileTable v-if="route.query?._profile === 'altr-ext:alt-profile'" :profiles="profiles" :path="route.path" />
    <ItemLayout v-else-if="collection.properties" :focusNode="collection.focusNode" :properties="collection.properties" :profiles="profiles" :path="route.path"></ItemLayout>
</template>
