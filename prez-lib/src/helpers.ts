import type { Prefixes } from "./types";
import { DEFAULT_PREFIXES } from "./consts";

/**
 * Interprets a predicate qname into its full URI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param s 
 * @param prefixes 
 * @returns Predicate URI string
 */
export function defaultToUri(s: string, prefixes: Prefixes = DEFAULT_PREFIXES): string {
    if (s === "a") { // special handling for "a" as rdf:type
        return prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        return prefixes[prefix] + pred;
    }
}

/**
 * Creates a qname from an URI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param uri 
 * @param prefixes 
 * @returns qname string
 */
export function defaultFromUri(uri: string, prefixes: Prefixes = DEFAULT_PREFIXES): string {
    let qname = "";
    Object.entries(prefixes).forEach(([prefix, prefixIri]) => {
        if (uri.startsWith(prefixIri)) {
            qname = prefix + ":" + uri.split(prefixIri)[1];
        }
    });
    return qname;
}