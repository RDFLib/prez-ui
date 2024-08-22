import type { PageState } from 'primevue/paginator';
import { computed } from 'vue';
import type { PrezDataList, PrezDataSearch } from '~/base/lib';

export const useGetInitialPageUrl = () => {
    const route = useRoute();
    const appConfig = useAppConfig();

    return route.path + '?' + new URLSearchParams({
        page: '1',
        per_page: (appConfig.pagination.itemsPerPage || 10).toString(),
        ...route.query,
    }).toString();

}

export const usePageInfo = (dataRef?: Ref<PrezDataList | PrezDataSearch | undefined>) => {
    const route = useRoute();
    const appConfig = useAppConfig();

    const pagination = computed(() => {
        const per_page = parseInt(route.query?.per_page?.toString() || (appConfig.pagination.itemsPerPage || 10).toString());
        const page = parseInt(route.query?.page?.toString() || '1');
        const first = (page - 1) * per_page + 1;

        return {
            per_page,
            page,
            first,
        };
    });

    const getPageUrl = () => {
        return route.path + '?' + new URLSearchParams({
            ...route.query, 
            page: pagination.value.page.toString(), 
            per_page: pagination.value.per_page.toString()
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