import type { Prefixes, PrezConceptNode, PrezFocusNode } from "./types";
import { DEFAULT_PREFIXES } from "./consts";

/**
 * Interprets a predicate curie into its full IRI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param s 
 * @param prefixes 
 * @returns Predicate IRI string
 */
export function defaultToIri(s: string, prefixes: Prefixes = DEFAULT_PREFIXES): string {
    if (s === "a") { // special handling for "a" as rdf:type
        return prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        return prefixes[prefix] + pred;
    }
}

/**
 * Creates a curie from an IRI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param iri 
 * @param prefixes 
 * @returns curie string
 */
export function defaultFromIri(iri: string, prefixes: Prefixes = DEFAULT_PREFIXES): string {
    let curie = "";
    Object.entries(prefixes).forEach(([prefix, prefixIri]) => {
        if (iri.startsWith(prefixIri)) {
            curie = prefix + ":" + iri.split(prefixIri)[1];
        }
    });
    return curie;
}

/**
 * Get the base URL from a URL, protocol & host
 * 
 * @param existingUrl existing URL to determine the base from
 * @returns 
 */
export const getBaseUrl = (existingUrl:string) => {
    const url = new URL(existingUrl);
    return `${url.protocol}//${url.hostname}`;
}

/**
 * Get the URL path (minus the protocol & host) from a full URL
 * 
 * 
 * @param existingUrl existing URL to determine the base from
 * @returns 
 */
export const getUrlPath = (existingUrl:string) => {
    const url = new URL(existingUrl);
    return url.pathname;
}

/**
 * Get the narrowers URL for a hierarchy based on an a concept and existing URL context
 * 
 * @param concept
 * @param existingUrl 
 * @returns 
 */
export const getNarrowersUrl = (concept:PrezConceptNode, existingUrl?:string) => {
    const baseUrl = existingUrl ? getBaseUrl(existingUrl) : '';
    const id = concept.identifiers?.find(identifier=>identifier.value)?.value;
    return id ? baseUrl + `/concept-hierarchy/${id}/narrowers` : '';
}

/**
 * Get the top concepts for a given focus node
 * 
 * @param item 
 * @param existingUrl 
 * @returns 
 */
export const getTopConceptsUrl = (item:PrezFocusNode, existingUrl?:string) => {
    const baseUrl = existingUrl ? getBaseUrl(existingUrl) : '';
    const id = item.identifiers?.find(identifier=>identifier.value)?.value;
    return id ? baseUrl + `/concept-hierarchy/${id}/top-concepts` : '';
}
