import { ref } from "vue";
import { Store, Writer, DataFactory, Parser } from "n3";

const defaultPrefixes = {
    "altr-ext": "http://www.w3.org/ns/dx/conneg/altr-ext#",
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "geo": "http://www.opengis.net/ont/geosparql#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "prez": "https://kurrawong.net/prez/",
    "prof": "http://www.w3.org/ns/dx/prof/",
    "prov": "http://www.w3.org/ns/prov#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "sdo": "https://schema.org/",
    "sh": "http://www.w3.org/ns/shacl#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "xsd": "http://www.w3.org/2001/XMLSchema#", 
};

export function useRdfStore() {
    // const { namedNode, literal, defaultGraph, quad } = DataFactory;

    const parser = new Parser();
    const store = ref(new Store());
    const prefixes = ref(defaultPrefixes);

    /**
     * Parses an RDF string in Turtle format into a store
     * 
     * @param {String} s RDF Turtle string
     */
    function parseIntoStore(s) {
        const p = parser.parse(s);
        store.value.addQuads(p);
        const defaultPrefixValues = Object.values(defaultPrefixes);
        const newPrefixes = Object.keys(parser._prefixes).filter(key => !defaultPrefixValues.includes(parser._prefixes[key]));
        prefixes.value = {...prefixes.value, ...newPrefixes};
    }

    /**
     * Interprets a predicate qname into its full IRI
     * 
     * Note: must be called after `parseIntoStore()`
     * 
     * @param {String} s qname string
     * @returns Predicate IRI string
     */
    function qname(s) {
        if (s === "a") { // special handling for "a" as rdf:type
            return prefixes.value.rdf + "type";
        } else {
            const [prefix, pred] = s.split(":");
            return prefixes.value[prefix] + pred;
        }
    }

    function clearStore() {
        // clear store
        store.value = new Store();

        // clear prefixes
        prefixes.value = defaultPrefixes;
    }

    // function serialize() {
    //     const writer = new Writer({prefixes: prefixObj.value});
    //     let s = "";
    //     for (const quad of store.value) {
    //         writer.addQuad(quad);
    //     }
    //     writer.end((error, result) => s = result);
    //     return s;
    // }

    return { store, prefixes, parseIntoStore, qname, clearStore };
}