<script lang="ts" setup>
import { type PrezItem, getList, type ProfileHeader } from "prez-lib";
import ListLayout from "~/components/ListLayout.vue";
import ProfileTable from "~/components/ProfileTable.vue";

const config = useRuntimeConfig();
const route = useRoute();

const items = ref<PrezItem[]>([]);
const profiles = ref<ProfileHeader[]>([]);
    const pageInfo = ref({
    page: route.query?.page ? Number(route.query.page) - 1 : 0, // current page - 1
    totalRecords: 0, // total count
    rows: route.query?.per_page ? Number(route.query.per_page) : 20, // per_page
});

onMounted(async () => {
    const { data, profiles: p, count } = await getList(config.public.apiUrl + route.fullPath);
    items.value = data;
    profiles.value = p;
    pageInfo.value.totalRecords = count;
})
</script>

<template>
    <ProfileTable v-if="route.query?._profile === 'altr-ext:alt-profile'" :profiles="profiles" :path="route.path" />
    <ListLayout v-else :items="items" :profiles="profiles" :path="route.path" :pageInfo="pageInfo">
        <h1>Profiles</h1>
        <p>A list of prof:Profiles</p>
    </ListLayout>
</template>
