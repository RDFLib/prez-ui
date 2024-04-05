<script lang="ts" setup>
import type { PrezUIItemListProps } from "prez-components";
import type { ProfileHeader } from "prez-lib";
import Paginator from "primevue/paginator";
import type { PageState } from "primevue/paginator";
import Message from "primevue/message";
import PrezUIItemList from "./PrezUIItemList.vue";
import ProfileNav from "./ProfileNav.vue";

const props = defineProps<PrezUIItemListProps & {
    path: string;
    profiles: ProfileHeader[];
    pageInfo: {
        page: number; // current page - 1
        totalRecords: number; // total count
        rows: number; // per_page
    };
    error?: Error | null;
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
        <Message v-if="props.error" severity="error" :closable="false">Error: {{ props.error.message }}</Message>
        <template v-else>
            <PrezUIItemList :data="props.data" :key="props.data?.length" :loading="props.loading" />
            <Paginator class="paginator" v-bind="props.pageInfo" @page="navigate" />
        </template>
    </main>
    <div id="right-nav">
        <slot name="rightNav"></slot>
        <ProfileNav :profiles="props.profiles" :path="props.path" :loading="props.loading" />
    </div>
</template>

<style lang="scss" scoped>
.paginator {
    margin-top: auto;
}

#right-nav {
    padding: 12px;
    min-width: 280px;
    max-width: 280px;
}
</style>