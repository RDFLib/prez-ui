import type { PageState } from 'primevue/paginator';
import { computed } from 'vue';
import type { PrezDataList, PrezDataSearch } from '~/base/lib';

export const useGetInitialPageUrl = () => {
    const route = useRoute();
    const appConfig = useAppConfig();

    return route.path + '?' + new URLSearchParams({
        page: '1',
        limit: (appConfig.pagination.itemsPerPage || 10).toString(),
        ...route.query,
    }).toString();

}

export const usePageInfo = (dataRef?: Ref<PrezDataList | PrezDataSearch | undefined>) => {
    const route = useRoute();
    const appConfig = useAppConfig();

    const pagination = computed(() => {
        const limit = parseInt(route.query?.limit?.toString() || (appConfig.pagination.itemsPerPage || 10).toString());
        const page = parseInt(route.query?.page?.toString() || '1');
        const first = (page - 1) * limit + 1;

        return {
            limit,
            page,
            first,
        };
    });

    const getPageUrl = () => {
        return route.path + '?' + new URLSearchParams({
            ...route.query, 
            page: pagination.value.page.toString(), 
            limit: pagination.value.limit.toString()
        }).toString();
    };

    function navigateToPage(e: PageState) {
        const page = e.page + 1;
        const queryParams = route.query;
        navigateTo({query: {...queryParams, page: page.toString()}});
    }

    const formSubmitToNavigate = (event: Event) => {
        const formElement = event.target as HTMLFormElement;
        const formData = new FormData(formElement);
      
        const queryParams: Record<string, string> = {};      
        formData.forEach((value, key) => {
          if (typeof value === 'string' && value.trim()) {
            queryParams[key] = value.toString();
          }
        });
        navigateTo({query: queryParams});
        event.preventDefault();
    };

    return {
        pagination,
        getPageUrl,
        navigateToPage,
        formSubmitToNavigate
    };
}