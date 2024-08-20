import { ref, watch } from 'vue';
import { getItem, getList, search } from "@/base/lib";
import type { PrezDataList, PrezDataItem, PrezDataSearch } from '@/base/lib';

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 min (in milliseconds)
type FetchStatus = 'idle' | 'pending' | 'success' | 'error';

// Centralized cache object
const cache = new Map<string, any>();

function cacheTransform(input: any) {
    return {
        ...input,
        fetchedAt: new Date(),
    };
}

function cacheGetData(key: string) {
    const data = cache.get(key);
    if (!data) return undefined;

    const expirationDate = new Date(data.fetchedAt);
    expirationDate.setTime(expirationDate.getTime() + CACHE_EXPIRY);

    if (expirationDate.getTime() < Date.now()) {
        cache.delete(key);
        return undefined;
    }

    return data;
}

function cacheSetData(key: string, data: any) {
    cache.set(key, data);
}

// Fetching list of items with caching
type ListOptions = {
    appendMode?: boolean;
}
export const useGetList = (baseUrl: string, urlPath: Ref<string>, options?:ListOptions) => {
    const data = ref<PrezDataList | undefined>(undefined);
    const status = ref<FetchStatus>('idle');
    const error = ref<Error | undefined>(undefined);
    const hasMore = ref(false);
    let append = options?.appendMode || false;

    const setData = (newData: PrezDataList) => {
        if(append) {
            if(data.value) {
                data.value.data = data.value.data.concat(newData.data);
                data.value.profiles = newData.profiles;
                data.value.count = newData.count;
                data.value.maxReached = newData.maxReached;
                data.value.parents = newData.parents;
            } else {
                data.value = newData;
            }
        } else {
            data.value = newData;
        }
        hasMore.value = data.value.data.length < data.value.count;
    }

    const execute = async (): Promise<PrezDataList> => {
        const cacheKey = urlPath.value;
        const cachedData = cacheGetData(cacheKey);

        if (cachedData) {
            setData(cachedData);
            status.value = 'success';
            return cachedData;
        }
        status.value = 'pending';
        try {
            const response = await getList(baseUrl, urlPath.value);
            setData(response);
            cacheSetData(cacheKey, cacheTransform(response));
            status.value = 'success';
            return response;
        } catch (ex) {
            error.value = new Error((ex as Error).message);
            hasMore.value = false;
            status.value = 'error';
            throw error.value;
        }
    };

    watch(urlPath, async (newVal, oldVal) => {
        await execute();
    }, { immediate: true });

    return {
        data,
        status,
        error,
        hasMore,
        execute
    };
};

// Fetching a single item with caching
export const useGetItem = (baseUrl: string, urlPath: Ref<string>) => {
    const data = ref<PrezDataItem | undefined>(undefined);
    const status = ref<FetchStatus>('idle');
    const error = ref<Error | undefined>(undefined);

    const execute = async (): Promise<PrezDataItem> => {
        const cacheKey = urlPath.value;
        const cachedData = cacheGetData(cacheKey);

        if (cachedData) {
            data.value = cachedData;
            status.value = 'success';
            return cachedData;
        }

        status.value = 'pending';
        try {
            const response = await getItem(baseUrl, urlPath.value);
            data.value = response;
            cacheSetData(cacheKey, cacheTransform(response));
            status.value = 'success';
            return response;
        } catch (ex) {
            error.value = new Error((ex as Error).message);
            status.value = 'error';
            throw error.value;
        }
    };

    watch(urlPath, async () => {
        await execute();
    }, { immediate: true });

    return {
        data,
        status,
        error,
        execute,
    };
};

// Fetching search results with caching
export const useSearch = (baseUrl: string, urlPath: Ref<string>) => {
    const data = ref<PrezDataSearch | undefined>(undefined);
    const status = ref<FetchStatus>('idle');
    const error = ref<Error | undefined>(undefined);

    const execute = async (): Promise<PrezDataSearch> => {
        const cacheKey = urlPath.value;
        const cachedData = cacheGetData(cacheKey);
        error.value = undefined;
        const query = new URL(baseUrl + urlPath.value).searchParams.get('q');
        if(!query) {
            status.value = 'success';
            data.value = undefined;
            return {
                type: 'search',
                data: [],
                profiles: [],
                count: 0,
                maxReached: false,
                parents: [],
            };
        }

        if (cachedData) {
            data.value = cachedData;
            status.value = 'success';
            return cachedData;
        }

        status.value = 'pending';
        data.value = undefined;
        try {
            const response = await search(baseUrl, urlPath.value);
            data.value = response;
            cacheSetData(cacheKey, cacheTransform(response));
            status.value = 'success';
            return response;
        } catch (ex) {
            error.value = new Error((ex as Error).message);
            status.value = 'error';
            throw error.value;
        }
    };

    watch(urlPath, async (newVal, oldVal) => {
        await execute();
    }, { immediate: true });

    return {
        data,
        status,
        error,
        execute,
    };
};
