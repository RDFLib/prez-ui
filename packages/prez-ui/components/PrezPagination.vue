<script lang="ts" setup>
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-vue-next";

const route = useRoute();

const props = defineProps<{
    totalItems: number;
    pagination: {
        limit: number;
        page: number;
        first: number;
    };
    maxReached: boolean;
}>();

// function navigateToPage(e) {
//     const page = e.page + 1;
//     const queryParams = route.query;
//     navigateTo({ query: { ...queryParams, page: page.toString() } });
// }
</script>

<template>
    <div class="flex flex-col gap-2 mt-4 pagination">
        <Pagination
            v-if="props.totalItems > props.pagination.limit || !props.maxReached"
            v-slot="{ page }"
            :total="props.totalItems"
            :itemsPerPage="props.pagination.limit"
            :sibling-count="1"
            show-edges
            :page="props.pagination.page"
            class="paginator"
        >
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1 justify-center">
                <PaginationFirst as-child>
                    <Button class="w-10 h-10 p-0" variant="outline" as-child>
                        <NuxtLink :to="{...route, query: { ...route.query, page: '1' }}">
                            <ChevronsLeft class="size-4" />
                        </NuxtLink>
                    </Button>
                </PaginationFirst>
                <PaginationPrev as-child>
                    <Button class="w-10 h-10 p-0" variant="outline" as-child>
                        <NuxtLink :to="{...route, query: { ...route.query, page: (props.pagination.page - 1).toString() }}">
                            <ChevronLeft class="size-4" />
                        </NuxtLink>
                    </Button>
                </PaginationPrev>

                <template v-for="(item, index) in items">
                    <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                        <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'" as-child>
                            <NuxtLink :to="{...route, query: { ...route.query, page: item.value.toString() }}">{{ item.value }}</NuxtLink>
                        </Button>
                    </PaginationItem>
                    <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext as-child :disabled="props.maxReached">
                    <Button class="w-10 h-10 p-0" variant="outline" as-child>
                        <NuxtLink :to="{...route, query: { ...route.query, page: (props.pagination.page + 1).toString() }}">
                            <ChevronRight class="size-4" />
                        </NuxtLink>
                    </Button>
                </PaginationNext>
                <PaginationLast as-child>
                    <Button class="w-10 h-10 p-0" variant="outline" as-child>
                        <NuxtLink :to="{...route, query: { ...route.query, page: Math.ceil(props.totalItems / props.pagination.limit).toString() }}">
                            <ChevronsRight class="size-4" />
                        </NuxtLink>
                    </Button>
                </PaginationLast>
            </PaginationContent>
        </Pagination>
        <PageLimitSelect :limit="props.pagination.limit" />
        <div v-if="props.totalItems > 0" class="pagination-text text-sm text-muted-foreground text-center">
            Showing {{ props.pagination.first }} to 
                {{ Math.min(props.pagination.first + props.pagination.limit - 1, props.totalItems) }} of 
                {{ props.totalItems }}{{ props.maxReached ? '' : '+' }} items
        </div>
    </div>
</template>