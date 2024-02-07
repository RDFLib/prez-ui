import type { Prefixes } from "@/types";

export const ALT_PROFILE_CURIE = "altr-ext:alt-profile";

export const ALT_PROFILE_URI = "http://www.w3.org/ns/dx/conneg/altr-ext#alt-profile";

export const DEFAULT_PREFIXES: Prefixes = {
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
};

export const CONTAINER_RELATIONS: { [key: string]: { predicate: string; inbound: boolean; } } = {
    "dcat:Dataset": {
        predicate: "rdfs:member",
        inbound: true
    },
    "dcat:Catalog": {
        predicate: "dcterms:hasPart",
        inbound: true
    },
    "skos:ConceptScheme": {
        predicate: "skos:inScheme",
        inbound: false
    },
    "skos:Collection": {
        predicate: "skos:member",
        inbound: true
    },
};
