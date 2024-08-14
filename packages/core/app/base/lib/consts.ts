import type { PrezPrefixes } from "./types";

// only add RDF prefix to handle a
export const DEFAULT_PREFIXES: PrezPrefixes = {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"    
};

/*
    "altr-ext": "http://www.w3.org/ns/dx/conneg/altr-ext#",
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "geo": "http://www.opengis.net/ont/geosparql#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "prez": "https://prez.dev/",
    "prof": "http://www.w3.org/ns/dx/prof/",
    "prov": "http://www.w3.org/ns/prov#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "reg": "http://purl.org/linked-data/registry#",
    "sdo": "https://schema.org/",
    "sh": "http://www.w3.org/ns/shacl#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "xsd": "http://www.w3.org/2001/XMLSchema#", 
};*/

export const PREZ_PREDICATES = {
    namespace: "https://prez.dev/",
    label: "https://prez.dev/label",
    description: "https://prez.dev/description",
    provenance: "https://prez.dev/provenance",
    focusNode: "https://prez.dev/FocusNode",
    link: "https://prez.dev/link",
    members: "https://prez.dev/members",
    identifier: "https://prez.dev/identifier",
    count: "https://prez.dev/count",
    searchResult: "https://prez.dev/SearchResult",
    searchResultWeight: "https://prez.dev/searchResultWeight",
    searchResultPredicate: "https://prez.dev/searchResultPredicate",
    searchResultURI: "https://prez.dev/searchResultURI",
    searchResultMatch: "https://prez.dev/searchResultMatch",
    hasChildren: "https://prez.dev/hasChildren"
};

export const SYSTEM_PREDICATES = {
    skosConceptScheme: "http://www.w3.org/2004/02/skos/core#ConceptScheme",
    skosConcept: "http://www.w3.org/2004/02/skos/core#Concept",
    a: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    rdfLangString: "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
    xmlString: "http://www.w3.org/2001/XMLSchema#string"
};

export const ANNOTATION_PREDICATES = {
    label: [
        // "http://www.w3.org/2000/01/rdf-schema#label",
        // "http://purl.org/dc/terms/title",
        // "http://www.w3.org/2004/02/skos/core#prefLabel",
        // "https://schema.org/name",
        "https://prez.dev/label"
    ],
    description: [
        // "http://purl.org/dc/terms/description",
        // "http://www.w3.org/2004/02/skos/core#definition",
        // "https://schema.org/description",
        "https://prez.dev/description"
    ],
    provenance: [
        // "http://purl.org/dc/terms/provenance",
        "https://prez.dev/provenance"
    ]
};
