import type { ProfileHeader, LinkObject, ListItem, ObjectItem } from "./types";
import { RDFStore } from "./store";

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
    profileObj[currentProfile.profile].current = true;

    // find default - no way to get default for now - use rel="canonical" according to https://www.w3.org/TR/dx-prof-conneg/#http-listprofiles ?
    // const defaultProfile = links.find(l => l.rel === "self")!;
    // profileObj[defaultProfile.profile].default = true;

    links.filter(l => l.rel === "alternate").forEach(l => {
        if (!profileObj[l.profile].mediatypes.map(m => m.mediatype).includes(l.type)) {
            profileObj[l.profile].mediatypes.push({ title: "", mediatype: l.type, default: false });
        }
    });

    // need to sort mediatypes by default first - need to use ui.profiles

    return Object.values(profileObj);
}

/**
 * Make a single async GET request, receiving turtle & profile link headers
 * 
 * @param url 
 * @returns 
 */
async function apiGet(url: string) {
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

// // profile header parsing
// function getProfileHeaders() {}

// // request functions
// async function getRequest(url: string, headers?: any) { }

// async function getRequestMultiple() { }

// async function apiGet(path: string) {
//     getRequest(`${API_BASE_URL}${path}`, {"Accept": "text/turtle"}); // text/turtle
//     getProfileHeaders();
// }

// async function apiGetMultiple() {
    
// }

// // async function sparqlGet() {
// //     // check if select or graph query
// //     getRequest(); // application/sparql-results+json or text/turtle
// // }

// async function sparqlGetMultiple() {

// }

// // service endpoints
// // export async function getApiInfo() {
// //     const { data } = await apiGet("/");
// //     const store = new RDFStore();
// //     store.load(data);
// //     // get annotation predicates
// //     // get preferred languages
// //     // get API version
// // }

/**
 * Gets a list of DCAT Catalogs from the Prez API
 * 
 * @returns a list of catalog objects
 */
export async function getCatalogs(apiBaseUrl: string, predicates?: {label: string, uri: string}[]): Promise<ListItem[]> {
    const { data } = await apiGet(`${apiBaseUrl}/c/catalogs`);
    console.log(data)
    const store = new RDFStore();
    store.load(data);
    return store.getItemList("dcat:Catalog", predicates);
}

export async function getCatalog(apiBaseUrl: string, curie: string): Promise<ObjectItem> {
    const { data } = await apiGet(`${apiBaseUrl}/c/catalogs/${curie}`);
    console.log(data)
    const store = new RDFStore();
    store.load(data);
    return store.getObjectTable("dcat:Catalog");
}

// export async function getResources() {

// }

// export async function getResource() { }

// export async function getDatasets() {

// }

// export async function getDataset() { }

// export async function getFeatureCollections() {

// }

// export async function getFeatureCollection() { }

// export async function getFeatures() {

// }

// export async function getFeature() { }

// export async function getVocabs() {

// }

// export async function getVocab() { }

// export async function getTopConcepts() {

// }

// export async function getNarrowers() { }

// export async function getConcept() { }

// export async function getCollections() {

// }

// export async function getCollection() { }

// export async function getProfiles() {

// }

// export async function getProfile() { }

// export async function getSearchResults() {

// }
