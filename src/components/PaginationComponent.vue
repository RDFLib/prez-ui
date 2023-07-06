<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import router from "@/router";

const PER_PAGE = 20;

const props = defineProps<{
    totalCount: number;
    perPage?: number;
    currentPage: number;
    url: string;
}>();

const pageDropdown = ref(props.currentPage);

const totalPages = computed(() => {
    const pageCount = props.perPage || PER_PAGE;
    return Math.ceil(props.totalCount / pageCount);
});

watch(pageDropdown, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        router.push(`${props.url}?page=${newValue}${props.perPage ? `&per_page=${props.perPage}` : ''}`);
    }
});
</script>

<template>
    <div class="pagination">
        <RouterLink
            v-if="props.currentPage > 2"
            :to="`${props.url}?page=1${props.perPage ? `&per_page=${props.perPage}` : ''}`"
            class="btn outline pagination-btn"
        >
            1
        </RouterLink>
        <div v-if="props.currentPage > 3"><i class="fa-regular fa-ellipsis"></i></div>
        <RouterLink
            v-if="props.currentPage > 1"
            :to="`${props.url}?page=${props.currentPage - 1}${props.perPage ? `&per_page=${props.perPage}` : ''}`"
            class="btn outline pagination-btn"
        >
            {{ props.currentPage - 1 }}
        </RouterLink>
        <select class="pagination-btn" name="" id="" title="Select page" v-model="pageDropdown">
            <option v-for="pageNo in [...Array(totalPages)].map((_, index) => index + 1)" :value="pageNo">{{ pageNo }}</option>
        </select>
        <RouterLink
            v-if="props.currentPage < totalPages"
            :to="`${props.url}?page=${props.currentPage + 1}${props.perPage ? `&per_page=${props.perPage}` : ''}`"
            class="btn outline pagination-btn"
        >
            {{ props.currentPage + 1 }}
        </RouterLink>
        <div v-if="props.currentPage < totalPages - 2"><i class="fa-regular fa-ellipsis"></i></div>
        <RouterLink
            v-if="props.currentPage < totalPages - 1"
            :to="`${props.url}?page=${totalPages}${props.perPage ? `&per_page=${props.perPage}` : ''}`"
            class="btn outline pagination-btn"
        >
            {{ totalPages }}
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
.pagination {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: auto;
    align-items: center;
    justify-content: center;

    select.pagination-btn {
        color: var(--primary);
        border: 1px solid var(--primary);
        font-size: 16px;
        padding: 6px 8px;
    }
}
</style>