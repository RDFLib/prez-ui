import type { AsyncDataRequestStatus, NuxtApp } from "#app";
import { getList, getItem, search, type PrezItem, type ProfileHeader, type PrezSearchResult } from "prez-lib";

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 min (in milliseconds)

// copied from Nuxt types
interface AsyncDataExecuteOptions {
    _initial?: boolean;
    /**
     * Force a refresh, even if there is already a pending request. Previous requests will
     * not be cancelled, but their result will not affect the data/pending state - and any
     * previously awaited promises will not resolve until this new request resolves.
     *
     * Instead of using `boolean` values, use `cancel` for `true` and `defer` for `false`.
     * Boolean values will be removed in a future release.
     */
    dedupe?: boolean | 'cancel' | 'defer';
};

/**
 * Adds the fetched datetime to the payload of data in the cache
 * 
 * @param input 
 * @returns 
 */
function cacheTransform(input: any) {
    return {
        ...input,
        fetchedAt: new Date()
    }
};

/**
 * Reuses cached data if the payload is younger than the expiration time
 * 
 * @param key 
 * @param nuxtApp 
 * @returns 
 */
function cacheGetData(key: string, nuxtApp: NuxtApp) {
    // if no data in the cache, do request
    const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    if (!data) {
        return;
    }

    // if data in the cache is too old, do request
    const expirationDate = new Date(data.fetchedAt);
    expirationDate.setTime(expirationDate.getTime() + CACHE_EXPIRY);
    const isExpired = expirationDate.getTime() < Date.now();
    if (isExpired) {
        return;
    }

    // else use data in cache
    return data;
};

/**
 * Composable for lazily fetching a list of items
 * 
 * @param url 
 * @returns 
 */
export const useGetList = async (url: string): Promise<{
    data: Ref<{
        data: PrezItem[];
        profiles: ProfileHeader[];
        count: number;
    }>;
    pending: Ref<boolean>;
    refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>;
    execute: (opts?: AsyncDataExecuteOptions) => Promise<void>;
    clear: () => void;
    error: Ref<Error | null>;
    status: Ref<AsyncDataRequestStatus>;
}> => {
    return useLazyAsyncData(url, () => getList(url), {
        default: () => {
            const d: {
                data: PrezItem[];
                profiles: ProfileHeader[];
                count: number;
            } = {
                data: [],
                profiles: [],
                count: 0
            }
            return d;
        },
        transform: cacheTransform,
        getCachedData: cacheGetData,
    });
};

/**
 * Composable for lazily fetching an item
 * 
 * @param url 
 * @param id 
 * @returns 
 */
export const useGetItem = async (url: string, id: string): Promise<{
    data: Ref<{
        data: PrezItem;
        profiles: ProfileHeader[];
    }>;
    pending: Ref<boolean>;
    refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>;
    execute: (opts?: AsyncDataExecuteOptions) => Promise<void>;
    clear: () => void;
    error: Ref<Error | null>;
    status: Ref<AsyncDataRequestStatus>;
}> => {
    return useLazyAsyncData(url, () => getItem(url, id), {
        default: () => {
            const d: {
                data: PrezItem;
                profiles: ProfileHeader[];
            } = {
                data: {} as PrezItem,
                profiles: [],
            }
            return d;
        },
        transform: cacheTransform,
        getCachedData: cacheGetData,
    });
};

async function blankSearch(): Promise<{
    data: PrezSearchResult[];
    profiles: ProfileHeader[];
}> {
    const d: {
        data: PrezSearchResult[];
        profiles: ProfileHeader[];
    } = {
        data: [],
        profiles: [],
    }
    return d;
}

/**
 * Composable for lazily fetching a search request
 * 
 * @param url 
 * @returns 
 */
export const useSearch = async (url: Ref<string>): Promise<{
    data: Ref<{
        data: PrezSearchResult[];
        profiles: ProfileHeader[];
    }>;
    pending: Ref<boolean>;
    refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>;
    execute: (opts?: AsyncDataExecuteOptions) => Promise<void>;
    clear: () => void;
    error: Ref<Error | null>;
    status: Ref<AsyncDataRequestStatus>;
}> => {
    return useLazyAsyncData("search", () => {
        if (url.value.trim().endsWith("?q=")) {
            return blankSearch();
        } else {
            return search(url.value);
        }
    }, {
        default: () => {
            const d: {
                data: PrezSearchResult[];
                profiles: ProfileHeader[];
            } = {
                data: [],
                profiles: [],
            }
            return d;
        },
        // transform: cacheTransform,
        // getCachedData: cacheGetData,
        watch: [url]
    });
};
