import { useUiStore } from "@/stores/ui";
import type { option } from "@/types";

const ui = useUiStore();

/**
 * Periodically checks if the profiles object is set in Pinia before resolving a Promise.
 * 
 * Loops every 500ms, times out after 20s.
 */
export function ensureProfiles() {
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
    const resourceRegex = new RegExp(`^\/c\/catalogs\/${curieRegex}\/${curieRegex}\/?$`);
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
