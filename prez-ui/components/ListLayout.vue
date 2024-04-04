<script lang="ts" setup>
import type { PrezListPage } from "prez-components";
import type { ProfileHeader } from "prez-lib";
import Paginator from "primevue/paginator";
import type { PageState } from "primevue/paginator";
import PrezUIItemList from "./PrezUIItemList.vue";
import ProfileNav from "./ProfileNav.vue";

const props = defineProps<PrezListPage & {
    path: string;
    profiles: ProfileHeader[];
    pageInfo: {
        page: number; // current page - 1
        totalRecords: number; // total count
        rows: number; // per_page
    };
}>();

async function navigate(e: PageState) {
    await navigateTo({
        path: props.path,
        query: {
            page: e.page + 1
        }
    });
}
</script>

<template>
    <main>
        <slot></slot>
        <PrezUIItemList :items="props.items" :key="props.items.length" />
        <Paginator class="paginator" v-bind="props.pageInfo" @page="navigate" />
    </main>
    <div id="right-nav">
        <slot name="rightNav"></slot>
        <ProfileNav :profiles="props.profiles" :path="props.path" />
    </div>
</template>

<style lang="scss" scoped>
.paginator {
    margin-top: auto;
}

#right-nav {
    padding: 12px;
    max-width: 300px;
}
</style>