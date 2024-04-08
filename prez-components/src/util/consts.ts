/**
 * A list of predicates to hide for display purposes
 */
export const HIDDEN_PREDICATES: string[] = [
    // labels
    "https://prez.dev/label",
    "http://purl.org/dc/terms/title",
    "http://www.w3.org/2000/01/rdf-schema#label",
    "http://www.w3.org/2004/02/skos/core#prefLabel",
    "https://schema.org/name",
    // descriptions
    "https://prez.dev/description",
    "http://purl.org/dc/terms/description",
    "http://www.w3.org/2004/02/skos/core#definition",
    "https://schema.org/description",
    // provenance
    "https://prez.dev/provenance",
    "http://purl.org/dc/terms/provenance",
    // members
    "https://prez.dev/members",
    "http://purl.org/dc/terms/hasPart",
    "http://www.w3.org/2000/01/rdf-schema#member",
    "http://www.w3.org/2004/02/skos/core#member",
    "https://schema.org/member",
    "http://www.w3.org/2004/02/skos/core#hasTopConcept",
    // system predicates
    "https://prez.dev/link",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "http://purl.org/dc/terms/identifier",
];
