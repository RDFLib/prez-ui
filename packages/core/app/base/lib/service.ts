import type { PrezDataItem, PrezDataList, PrezDataSearch, PrezProfileHeader } from "./types";
import { RDFStore } from "./store";
import { getUrlPath } from "./helpers";

type LinkObject = {
    uri: string;
    rel: string;
    title: string;
    anchor: string;
    token: string;
    profile: string;
    type: string;
};

class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

/**
 * Generates profiles from link headers
 * 
 * @param linkHeader 
 * @returns a list of profile objects
 */
function getProfilesFromHeaders(linkHeader: string): PrezProfileHeader[] {
    let profileObj: {[uri: string]: PrezProfileHeader} = {} ;
    const links = linkHeader.split(", ").map(l => {
        const [, uri, attrs] = l.match(/<(.+)>; (.+)/) as [string, string, string];
        const linkObj = { uri } as LinkObject;
        attrs.split("; ").forEach(attr => {
            const [, lhs, rhs] = attr.match(/(.+)=[\"<](.+)[\">]/) as [string, keyof Omit<LinkObject, "uri">, string];
            linkObj[lhs] = rhs;
        });
        return linkObj;
    });
    links.filter(l => l.rel === "type").forEach(l => {
        profileObj[l.anchor] = {
            default: false,
            current: false,
            token: l.token,
            mediatypes: [],
            title: l.title,
            description: "",
            uri: l.anchor
        };
    });

    // find current - either use rel="self" or rel="profile"
    const currentProfile = links.find(l => l.rel === "self")!;
    profileObj[currentProfile!.profile]!.current = true;

    // find default - no way to get default for now - use rel="canonical" according to https://www.w3.org/TR/dx-prof-conneg/#http-listprofiles ?
    // const defaultProfile = links.find(l => l.rel === "self")!;
    // profileObj[defaultProfile.profile].default = true;

    links.filter(l => l.rel === "alternate").forEach(l => {
        if (!profileObj[l.profile]!.mediatypes.map(m => m.mediatype).includes(l.type)) {
            profileObj[l.profile]!.mediatypes.push({ title: "", mediatype: l.type, default: false });
        }
    });

    return Object.values(profileObj);
}

/**
 * Does a GET request to a Prez API endpoint
 * 
 * @param url 
 * @returns 
 */
export async function apiGet(url: string) {
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
 * Gets a list of item objects from a listing endpoint
 * 
 * @param url 
 * @returns the list of item objects
 */
export async function getList(url: string): Promise<PrezDataList> {
    const { data, profiles } = await apiGet(url);
    const store = new RDFStore();
    store.load(data);
    const path = getUrlPath(url);
    return { type: 'list', data: store.getList(), profiles, 
        maxReached: store.getMaxReached(), count: store.getCount(), 
        parents: store.getParents(path) 
    };
}


/**
 * Gets an item object from an item endpoint
 * 
 * @param url 
 * @param id the prez:identifier of the object to get
 * @returns the item object
 */
export async function getItem(url: string): Promise<PrezDataItem> {
    const { data, profiles } = await apiGet(url);
    const store = new RDFStore();
    store.load(data);
    const path = getUrlPath(url);
    return { type: 'item', data: store.getItem(), profiles, parents: store.getParents(path) };
}

/**
 * Runs a search query
 * 
 * @param url 
 * @returns 
 */
export async function search(url: string): Promise<PrezDataSearch> {
    const { data, profiles } = await apiGet(url);
    const store = new RDFStore();
    store.load(data);
    const path = getUrlPath(url);
    return { 
        type: 'search', data: store.search(), profiles, 
        maxReached: store.getMaxReached(), count: store.getCount(), 
        parents: store.getParents(path) 
    };
}
