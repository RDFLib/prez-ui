import type { RouteLocationNormalizedLoaded } from "vue-router";
import { DataFactory, type Store, type Quad, type Literal } from "n3";
import type { option, link, languageLabel } from "@/types";
import { useUiStore } from "@/stores/ui";
import { DEFAULT_LABEL_PREDICATES, DEFAULT_PREFIXES, CONTAINER_RELATIONS } from "@/util/consts";

const { namedNode } = DataFactory;

/**
 * Periodically checks if the profiles object is set in Pinia before resolving a Promise.
 * 
 * Loops every 500ms, times out after 20s.
 */
export function ensureProfiles() {
    const ui = useUiStore();

    return new Promise<void>((resolve, reject) => {
        let expTimer = setTimeout(reject, 20 * 1000); // time out after 20s
               
        (function waitForProfiles() {
            if (Object.keys(ui.profiles).length > 0) {
                clearTimeout(expTimer);
                return resolve();
            };
            setTimeout(waitForProfiles, 500); // checks every 500ms
        })();
    });
};

/**
 * Copies text to the clipboard
 * 
 * @param text The text to copy to the clipboard
 */
export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text.trim());
}

/**
 * Capitalises the first letter of a string
 * 
 * @param s 
 * @returns 
 */
export function titleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Converts camelCase to Title Case
 * 
 * @param s 
 * @returns 
 */
export function camelToTitleCase(s: string): string {
    const result = s.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Sorts an array of objects alphabetically first, and then by IRI if some elements lack a title
 * 
 * @param a 
 * @param b 
 * @returns 
 */
export const sortByTitle = <T extends {title?: string; iri: string;}>(a: T, b: T): number => {
    if (a.title && b.title) {
        return a.title.localeCompare(b.title);
    } else if (a.title) {
        return -1;
    } else if (b.title) {
        return 1;
    } else {
        return a.iri.localeCompare(b.iri);
    }
};

/**
 * Returns an integer priority based on an RDF literal's language tag
 * 
 * Priority order is: 1. `@en`, 2. `@en-*`, 3. No language tag, 4. Other language tags.
 * 
 * @param language 
 * @returns the priority order as an integer
 */
export function getLanguagePriority(language: string): number {
    // get browser language, return 0
    if (language === "en") {
        return 1;
    } else if (/en-.+/.test(language)) { // en-us, en-gb, etc.
        return 2;
    } else if (language === "") {
        return 3;
    } else {
        return 4;
    }
}


/**
 * Get the base class from the URL structure
 * 
 * @param link 
 * @returns 
 */
export function getBaseClassFromLink(link: string): {iri: string; title: string} {
    const curieRegex = "[a-zA-Z0-9\\.\\-_]+:[a-zA-Z0-9\\.\\-_]+";
    const profileRegex = new RegExp(`^(\/[csv])?\/profiles\/${curieRegex}\/?$`);
    const catalogRegex = new RegExp(`^\/c\/catalogs\/${curieRegex}\/?$`);
    const resourceRegex = new RegExp(`^\/c\/catalogs\/${curieRegex}\/resources\/${curieRegex}\/?$`);
    const datasetRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/?$`);
    const featureCollectionRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/collections\/${curieRegex}\/?$`);
    const featureRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/collections\/${curieRegex}\/items\/${curieRegex}\/?$`);
    const vocabRegex = new RegExp(`^\/v\/vocab\/${curieRegex}\/?$`);
    const collectionRegex = new RegExp(`^\/v\/collection\/${curieRegex}\/?$`);
    const conceptRegex = new RegExp(`^\/v\/(vocab|collection)\/${curieRegex}\/${curieRegex}\/?$`);

    switch (true) {
        case profileRegex.test(link):
            return { iri: "http://www.w3.org/ns/dx/prof/Profile", title: "Profile" };
        case catalogRegex.test(link):
            return { iri: "http://www.w3.org/ns/dcat#Catalog", title: "Catalog" };
        case resourceRegex.test(link):
            return { iri: "http://www.w3.org/ns/dcat#Resource", title: "Resource" };
        case datasetRegex.test(link):
            return { iri: "http://www.w3.org/ns/dcat#Dataset", title: "Dataset" };
        case featureCollectionRegex.test(link):
            return { iri: "http://www.opengis.net/ont/geosparql#FeatureCollection", title: "Feature Collection" };
        case featureRegex.test(link):
            return { iri: "http://www.opengis.net/ont/geosparql#Feature", title: "Feature" };
        case vocabRegex.test(link):
            return { iri: "http://www.w3.org/2004/02/skos/core#ConceptScheme", title: "Concept Scheme" };
        case collectionRegex.test(link):
            return { iri: "http://www.w3.org/2004/02/skos/core#Collection", title: "Collection" };
        case conceptRegex.test(link):
            return { iri: "http://www.w3.org/2004/02/skos/core#Concept", title: "Concept" };
        default:
            return { iri: "", title: "" };
    }
}

/**
 * 
 * 
 * @param options 
 * @param selected 
 * @returns 
 */
export function allOptionsSelected(options: option[], selected: string[]): boolean {
    return options.every(option => selected.includes(option.iri));
}

/**
 * Constructs an object containing parent information within a link
 * 
 * @param store the RDF store
 * @param linkQuad the quad containing the `prez:link`
 * @returns the link object
 */
export function getLink(store: Store, linkQuad: Quad): link {
    type linkParent = { // ordered - grandparent, parent
        iri: string;
        title?: string;
        link: string;
        types: {
            iri: string;
            title?: string;
        }[];
    };
    const parents: linkParent[] = [];

    // get matching parents by ID in the link, omitting self
    const parentIds = store.getQuads(null, namedNode(defaultQnameToIri("dcterms:identifier")), null, null).filter(q1 => linkQuad.object.value.slice(0, linkQuad.object.value.lastIndexOf("/")).includes(q1.object.value));

    parentIds.forEach(parentQuad => {
        const parent: linkParent = {
            iri: parentQuad.subject.value,
            link: linkQuad.object.value.split(parentQuad.object.value)[0] + parentQuad.object.value,
            types: []
        };
        
        const labels: languageLabel[] = [];
        store.forEach(q1 => {
            if (DEFAULT_LABEL_PREDICATES.includes(q1.predicate.value)) {
                let language = (q1.object as Literal).language;
                labels.push({
                    value: q1.object.value,
                    language: language || undefined,
                    priority: getLanguagePriority(language)
                });
            }
        }, namedNode(parentQuad.subject.value), null, null, null);

        labels.sort((a, b) => a.priority - b.priority);
        parent.title = labels.length > 0 ? labels[0].value : undefined;

        store.getObjects(namedNode(parentQuad.subject.value), namedNode(defaultQnameToIri("a")), null).forEach(t => {
            const typeLabel = store.getObjects(t, namedNode(defaultQnameToIri("rdfs:label")), null);
            parent.types.push({
                iri: t.value,
                title: typeLabel.length > 0 ? typeLabel[0].value : undefined,
            });
        });

        parents.push(parent);
    });

    // sort by order of appearance in link
    parents.sort((a, b) => a.link.length - b.link.length);

    return {
        parents: parents,
        link: linkQuad.object.value
    };
}

/**
 * Interprets a predicate qname into its full IRI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param s 
 * @param prefixes 
 * @returns Predicate IRI string
 */
export function defaultQnameToIri(s: string, prefixes: { [token: string]: string } = DEFAULT_PREFIXES): string {
    if (s === "a") { // special handling for "a" as rdf:type
        return prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        return prefixes[prefix] + pred;
    }
}

/**
 * Creates a query string argument based on a container's base class
 * 
 * @param baseClass 
 * @returns the query string
 */
export function containerQsa(baseClass: string): string {
    return `${CONTAINER_RELATIONS[baseClass].inbound ? 'filter-to-focus' : 'focus-to-filter'}[${CONTAINER_RELATIONS[baseClass].predicate}]`;
}

/**
 * Safely gets the value of a query string argument, or returns `undefined`
 * 
 * @param route vue-router route object from `useRoute()`
 * @param key 
 * @returns the value as a string, or undefined if the key doesn't exist
 */
export function getQSA(route: RouteLocationNormalizedLoaded, key: string): string | undefined {
    if (Object.keys(route.query).length > 0) {
        if (key in route.query) {
            return route.query[key]?.toString();
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

/**
 * Combines the arguments from the current query object with a provided one to create a new query string
 * 
 * @param route vue-router route object from `useRoute()`
 * @param addQSA object representing the new `route.query` object
 * @param removeQSA array of keys to remove from the query string
 * @returns new query string
 */
export function newQSAString(route: RouteLocationNormalizedLoaded, addQSA: {[key: string]: any} = {}, removeQSA: string[] = []): string {
    const queryObj = {...route.query, ...addQSA};
    removeQSA?.forEach(key => {
        if (key in queryObj) {
            delete queryObj[key];
        }
    });
    let queryString = "";
    if (Object.keys(queryObj).length > 0) {
        queryString += "?" + Object.entries(queryObj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    }
    return queryString;
}
