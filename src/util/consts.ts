import { defaultQnameToIri } from "@/util/helpers";

export const DEFAULT_PREFIXES: { [token: string]: string } = {
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

// soon will get these from Prez API root endpoint as config
export const DEFAULT_LABEL_PREDICATES: string[] = [
    defaultQnameToIri("rdfs:label"),
    defaultQnameToIri("dcterms:title"),
    defaultQnameToIri("skos:prefLabel"),
    defaultQnameToIri("sdo:name"),
];

export const DEFAULT_DESC_PREDICATES: string[] = [
    defaultQnameToIri("dcterms:description"),
    defaultQnameToIri("skos:definition"),
    defaultQnameToIri("sdo:description"),
];

export const DEFAULT_EXPL_PREDICATES: string[] = [
    defaultQnameToIri("dcterms:provenance")
];
