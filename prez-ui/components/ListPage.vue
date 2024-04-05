<script lang="ts" setup>
import { useGetList } from "~/composables/api";
import { ALT_PROFILE_TOKEN } from "~/util/consts";

const config = useRuntimeConfig();
const route = useRoute();
const { data, pending, error } = await useGetList(config.public.apiUrl + route.fullPath);

const pageInfo = useState("pageInfo", () => shallowRef({
    page: route.query?.page ? Number(route.query.page) - 1 : 0, // current page - 1
    totalRecords: 0, // total count
    rows: route.query?.per_page ? Number(route.query.per_page) : 20, // per_page
}));

pageInfo.value.totalRecords = data.value.count;
</script>

<template>
    <ProfileTable v-if="route.query?._profile === ALT_PROFILE_TOKEN" :profiles="data.profiles" :path="route.path" />
    <ListLayout v-else :data="data.data" :profiles="data.profiles" :path="route.path" :pageInfo="pageInfo" :loading="pending" :error="error">
        <slot></slot>
    </ListLayout>
</template>
