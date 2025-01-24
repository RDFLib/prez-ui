import type { PrezPrefixes, PrezConceptNode, PrezFocusNode } from "./types";
import { DEFAULT_PREFIXES, SYSTEM_PREDICATES } from "./consts";

/**
 * Interprets a predicate curie into its full IRI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param s 
 * @param prefixes 
 * @returns Predicate IRI string
 */
export function defaultToIri(s: string, prefixes: PrezPrefixes = DEFAULT_PREFIXES): string {
    if (s === "a") { // special handling for "a" as rdf:type
        return prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        if (!prefix) {
            return s;
        }
        return [prefix] + pred!;
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
export function defaultFromIri(iri: string, prefixes: PrezPrefixes = DEFAULT_PREFIXES): string {
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
export const getNarrowersUrl = (baseUrl:string, concept:PrezConceptNode) => {
    const id = concept.identifiers?.find(identifier=>identifier.value)?.value;
    return id ? baseUrl + `/concept-hierarchy/${id}/narrowers` : '';
}

/**
 * Get the top concepts for a given focus node
 * 
 * @param item 
 * @param existingOrBaseUrl to use for prefixing
 * @returns 
 */
export const getTopConceptsUrl = (item:PrezFocusNode, existingOrBaseUrl?:string) => {
    const baseUrl = existingOrBaseUrl ? getBaseUrl(existingOrBaseUrl) : '';
    const identifiers = item.identifiers?.find(identifier=>identifier.value);
    const id = identifiers ? identifiers.value : '';
    const url = id ? baseUrl + `/concept-hierarchy/${id}/top-concepts` : '';
    return url;
}

type PathElement = { "@id"?: string; "@list"?: PathElement[] };

/**
 * Process a SHACL path to get the full list of predicates
 * 
 * @param path 
 * @returns 
 */
export const processShaclPath = (path: PathElement[]): string[] => {
    return path.flatMap((e) => {
        if (e["@id"]) {
            return e["@id"];
        }

        if (e["@list"] && e["@list"].length > 0) {
            const firstElement = e["@list"][0];
            // Check if the first element indicates a shacl union
            if (firstElement?.["@id"] === SYSTEM_PREDICATES.shaclUnion) {
                // Recursively process only the union elements
                return processShaclPath(e["@list"][1]?.["@list"] || []).filter(Boolean);
            } else {
                // Process non-union lists as normal
                return processShaclPath(e["@list"]).flat();
            }
        }

        return [];
    }).filter((item): item is string => Boolean(item));
}
/**
 * Build a profile object from a list of profiles
 * 
 * @param data - list of profiles in json-ld format
 * @returns 
 */
export const buildProfiles = (data: any[]): Record<string, string[]> => {
    return data.reduce((acc, profile) => {
      // get the SHACL path for each profile
      if (SYSTEM_PREDICATES.shaclProperty in profile) {
        // get the SHACL path for each property
        for (const props of profile[SYSTEM_PREDICATES.shaclProperty]) {
          // find the profile in the data
          const lookup = data.find((p: any) => p['@id'] === props['@id']);
          if (lookup && SYSTEM_PREDICATES.shaclPath in lookup) {
            acc[profile['@id']] = processShaclPath(lookup[SYSTEM_PREDICATES.shaclPath])
              // filter #allPredicates, as it is a special case that is a placeholder to indicate all predicates, which is the same as an empty array
              .filter(prop=>prop !== SYSTEM_PREDICATES.shaclAllPredicates);
          }
        }
      }
      return acc;
    }, {} as Record<string, string[]>);
}

/** this function is used to construct a simple object to show profile info in the debug panel */
export function simplifyNodeArray(input: any): any {
  if (Array.isArray(input)) {
    // Handle arrays recursively and merge objects
    return input.reduce((acc, item) => {
      const result = simplifyNodeArray(item);
      if (typeof result === 'object' && !Array.isArray(result)) {
        Object.assign(acc, result); // Merge objects instead of creating arrays of objects
      }
      return acc;
    }, {});
  } else if (typeof input === 'object' && input !== null) {
    // Check for 'value' property and return it
    if (input.hasOwnProperty('value')) {
      return input.value;
    } else if (input.hasOwnProperty('node') && input.hasOwnProperty('list')) {
      // Custom logic for converting 'node' and 'list' structure
      const result: any = {};
      result[input.node.value] = input.list.length > 0 ? simplifyNodeArray(input.list) : "";
      return result;
    } else {
      // Recursively handle other objects
      const result: any = {};
      for (const key in input) {
        result[key] = simplifyNodeArray(input[key]);
      }
      return result;
    }
  }
  return input; // Return item as-is if it's neither array nor object
}

/* turn a node array into a tree object, for the debug panel */
export function nodeArrayToTree(obj:any, prefix = '') {
    let tree = '';
    const entries = Object.entries(obj);
    const totalEntries = entries.length;
  
    entries.forEach(([key, value], index) => {
      // Remove http(s):// and www.
      const formattedKey = key.replace(/https?:\/\/(www\.)?/, '');
      const [domainAndPath, fragment] = formattedKey.split('#');
      const pathParts = domainAndPath!.split('/');
      const lastPathPart = pathParts[pathParts.length - 1];
      const displayKey = fragment 
        ? `(${pathParts[0]})/${lastPathPart}#${fragment}` 
        : `(${pathParts[0]})/${lastPathPart}`;
  
      const isLast = index === totalEntries - 1;
      const branch = isLast ? '└── ' : '├── ';
      tree += `${prefix}${branch}${displayKey}\n`;
  
      // If the value is an object, recurse into it
      if (typeof value === 'object' && value !== null) {
        const newPrefix = isLast ? '    ' : '│   ';
        tree+= nodeArrayToTree(value, prefix + newPrefix);
      }
    });
  
    return tree;
}

/** this function is used to dump a profile node array into a simple string tree */
export function dumpNodeArray(obj:any) {
    return obj ? nodeArrayToTree(simplifyNodeArray(obj)) : '';
}
