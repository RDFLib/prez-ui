import { ref, inject } from "vue";
import { apiBaseUrlConfigKey, type ProfileHeader, type LinkObject } from "@/types";

class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

/**
 * Parses a link header component
 * 
 * @param link 
 * @returns 
 */
function parseLinkHeader(link: string): LinkObject {
    const [, uriRef, attrs] = link.match(/<(.+)>; (.+)/)!;
    let linkObj: Partial<LinkObject> = { uriRef };

    attrs.split("; ").forEach(l => {
        const [, lhs, rhs] = l.match(/(.+)=[\"<](.+)[\">]/) as [string, keyof Omit<LinkObject, "uriRef">, string];
        linkObj[lhs] = rhs;
    });

    return linkObj as LinkObject;
}

/**
 * Make a single async GET request, receiving turtle & profile link headers
 * 
 * @param url 
 * @returns 
 */
async function individualApiRequest(url: string) {
    const r = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "text/anot+turtle"
        }
    });

    if (!r.ok) {
        throw new NetworkError(`Network error - status code ${r.status}: ${r.statusText}`);
    }

    // parse link headers for profiles
    const profiles = r.headers.get("link") ? getProfilesFromHeaders(r.headers.get("link")!) : [];

    const data = await r.text(); // always get turtle string
    return { data, profiles };
}

/**
 * Gets a list of profiles from Link headers
 * 
 * @param link 
 * @returns 
 */
function getProfilesFromHeaders(link: string): ProfileHeader[] {
    let profileObj: {[uri: string]: ProfileHeader} = {} ;

    const links = link.split(", ").map(l => parseLinkHeader(l));

    links.filter(l => l.rel === "type").forEach(l => {
        profileObj[l.anchor] = {
            default: false,
            token: l.token,
            mediatypes: [],
            title: l.title,
            description: "",
            uri: l.anchor
        };
    });

    const defaultProfile = links.find(l => l.rel === "self")!;
    profileObj[defaultProfile.profile].default = true;

    links.filter(l => l.rel === "alternate").forEach(l => {
        if (!profileObj[l.profile].mediatypes.map(m => m.mediatype).includes(l.type)) {
            profileObj[l.profile].mediatypes.push({ title: "", mediatype: l.type, default: false });
        }
    });

    // need to sort mediatypes by default first - need to use ui.profiles

    return Object.values(profileObj);
}

/**
 * Used for making async GET requests
 * 
 * @returns 
 */
export function useGetRequest() {
    const loading = ref(false);
    const error = ref("");

    /**
     * Perform an async GET request
     * 
     * @param url 
     * @param headers 
     * @returns 
     */
    async function getRequest(url: string, headers: {[key: string]: string}) {
        loading.value = true;
        let data: string = "";

        try {
            const r = await fetch(url, {
                method: "GET",
                headers: headers
            });
        
            if (!r.ok) {
                throw new NetworkError(`Network error - status code ${r.status}: ${r.statusText}`);
            }
        
        
            data = await r.text(); // always get turtle string
        } catch (e) {
            if (e instanceof TypeError) { // TypeError - fetch error
                error.value = e.message;
            } else if (e instanceof NetworkError) { // NetworkError - status code error
                error.value = e.message;
            } else if (e instanceof SyntaxError) { // SyntaxError - .text() parsing error
                error.value = e.message;
            }
        }

        loading.value = false;
        return data;
    };

    return {
        loading,
        error,
        getRequest
    };
};

/**
 * Used for making async API requests to the Prez backend
 * 
 * @returns 
 */
export function useApiRequest() {
    const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
    const loading = ref(false);
    const error = ref("");

    /**
     * Perform an async GET request to the Prez API
     * 
     * @param path 
     * @returns data, profiles
     */
    async function apiGetRequest(path: string) {
        loading.value = true;
        let data: string = "";
        let profiles: ProfileHeader[] = [];

        try {
            ({ data, profiles } = await individualApiRequest(`${apiBaseUrl}${path}`));
        } catch (e) {
            if (e instanceof TypeError) { // TypeError - fetch error
                error.value = e.message;
            } else if (e instanceof NetworkError) { // NetworkError - status code error
                error.value = e.message;
            } else if (e instanceof SyntaxError) { // SyntaxError - .text() parsing error
                error.value = e.message;
            }
        }

        loading.value = false;
        return { data, profiles };
    };

    return {
        loading,
        error,
        apiGetRequest
    };
};

/**
 * Used for making multiple concurrent async API requests to the Prez backend
 * 
 * @returns 
 */
export function useConcurrentApiRequests() {
    const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
    const loading = ref(false);
    const hasError = ref(false);

    /**
     * Perform multiple concurrent async GET requests to the Prez API
     * 
     * @param path 
     * @returns data
     */
    async function concurrentApiRequests(paths: string[]) {
        loading.value = true;
        let data: {
            value: string;
            profiles: ProfileHeader[];
            error: any;
        }[] = [];

        await Promise.allSettled(paths.map(path => individualApiRequest(`${apiBaseUrl}${path}`))).then(resp => {
            if (!resp.every(r => r.status === "fulfilled")) {
                hasError.value = true;
            }
            
            data = resp.map(r => {
                return {
                    value: r.status === "fulfilled" ? r.value.data: "",
                    profiles: r.status === "fulfilled" ? r.value.profiles : [],
                    error: r.status === "fulfilled" ? "" : r.reason
                };
            });
        });

        loading.value = false;
        return data;
    };

    return {
        loading,
        hasError,
        concurrentApiRequests
    };
};

/**
 * Used for making async SPARQL requests
 */
export function useSparqlRequest() {
    const loading = ref(false);
    const error = ref("");
    
    /**
     * Perform an async SPARQL GET request
     * 
     * @param path 
     * @returns data
     */
    async function sparqlGetRequest(url: string, query: string) {
        loading.value = true;
        let data: any = "";
        let isGraphQuery = ["CONSTRUCT", "DESCRIBE"].some(e => query.includes(e));

        try {
            const r = await fetch(`${url}?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    "Accept": isGraphQuery ? "text/turtle" : "application/sparql-results+json"
                }
            });
        
            if (!r.ok) {
                throw new NetworkError(`Network error - status code ${r.status}: ${r.statusText}`);
            }
        
        
            data = isGraphQuery ? await r.text() : await r.json();
        } catch (e) {
            if (e instanceof TypeError) { // TypeError - fetch error
                error.value = e.message;
            } else if (e instanceof NetworkError) { // NetworkError - status code error
                error.value = e.message;
            } else if (e instanceof SyntaxError) { // SyntaxError - .text() parsing error
                error.value = e.message;
            }
        }

        loading.value = false;
        return data;
    };

    return {
        loading,
        error,
        sparqlGetRequest
    };
};