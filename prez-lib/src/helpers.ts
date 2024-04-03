import type { Prefixes } from "./types";
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