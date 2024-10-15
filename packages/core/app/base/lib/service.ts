import type { PrezBlankNode, PrezDataItem, PrezDataList, PrezDataSearch, PrezProfileHeader, PrezProfiles } from "./types";
import { RDFStore } from "./store";
import { getUrlPath } from "./helpers";
import { SYSTEM_PREDICATES } from "./consts";

type LinkObject = {
    uri: string;
    rel: string;
    title: string;
    anchor: string;
    token: string;
    format: string;
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
    
    const links = linkHeader.split(",").map(l => {
        const [, uri, attrs] = l.trim().match(/<(.+)>; (.+)/) as [string, string, string];
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
    if(currentProfile!.format in profileObj) {
        profileObj[currentProfile!.format]!.current = true;
    }

    // find default - no way to get default for now - use rel="canonical" according to https://www.w3.org/TR/dx-prof-conneg/#http-listprofiles ?
    // const defaultProfile = links.find(l => l.rel === "self")!;
    // profileObj[defaultProfile.profile].default = true;

    links.filter(l => l.rel === "alternate" && l.format).forEach(l => {
        if (!profileObj[l.format]!.mediatypes.map(m => m.mediatype).includes(l.type)) {
            profileObj[l.format]!.mediatypes.push({ title: "", mediatype: l.type, default: false });
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
    const linkHeaders = r.headers.get("link") || r.headers.get("Link");
    const profiles = linkHeaders ? getProfilesFromHeaders(linkHeaders) : [];

    const data = await r.text(); // always get turtle string
    return { data, profiles };
}

/**
 * Gets a list of item objects from a listing endpoint
 * 
 * @param url 
 * @returns the list of item objects
 */
export async function getList(baseUrl:string, path: string): Promise<PrezDataList> {
    const url = baseUrl + path;
    const pathOnly = new URL(url).pathname
    const { data, profiles } = await apiGet(url);
    const store = new RDFStore();
    store.setBaseUrl(baseUrl);
    store.load(data);
    return { type: 'list', data: store.getList(), profiles, 
        maxReached: store.getMaxReached(), count: store.getCount(), 
        parents: store.getParents(pathOnly)
    };
}


/**
 * Gets an item object from an item endpoint, note store is returned in order to allow for additional nested processing calls
 * 
 * @param url 
 * @param id the prez:identifier of the object to get
 * @returns the item object
 */
export async function getItem(baseUrl: string, path: string): Promise<PrezDataItem> {
    const url = baseUrl + path;
    const pathOnly = new URL(url).pathname
    const { data, profiles } = await apiGet(url);
    const store = new RDFStore();
    store.setBaseUrl(baseUrl);
    store.load(data);
    return { type: 'item', data: store.getItem(), profiles, parents: store.getParents(pathOnly), store };
}

/**
 * Runs a search query
 * 
 * @param url 
 * @returns 
 */
export async function search(baseUrl: string, path: string): Promise<PrezDataSearch> {
    const url = baseUrl + path;
    const pathOnly = new URL(url).pathname
    const { data, profiles } = await apiGet(url);
    const store = new RDFStore();
    store.setBaseUrl(baseUrl);
    store.load(data);
    return { 
        type: 'search', data: store.search(), profiles, 
        maxReached: store.getMaxReached(), count: store.getCount(), 
        parents: store.getParents(pathOnly)
    };
}

export async function getProfiles(baseUrl: string): Promise<PrezProfiles> {
    const path = '/profiles?page=1&limit=999&_mediatype=application/anot%2Bturtle';
    const { data } = await getList(baseUrl, path);
    const profiles: PrezProfiles = {};
    for(const profile of data) {
        profiles[profile.value] = [];
        if(profile.properties && profile.properties?.[SYSTEM_PREDICATES.shaclProperty]?.objects) {
            const objects = profile.properties[SYSTEM_PREDICATES.shaclProperty]!.objects;
            for(const obj of objects) {
                const bn = obj as PrezBlankNode;
                if(bn.properties && bn.properties[SYSTEM_PREDICATES.shaclPath]) {
                    for(const obj2 of bn.properties[SYSTEM_PREDICATES.shaclPath]!.objects) {
                        const list = (obj2 as PrezBlankNode).list;
                        if(list) {
                            profiles[profile.value] = list;
                        }
                    }    
                }
            }
        }
    }
    return profiles;
}


