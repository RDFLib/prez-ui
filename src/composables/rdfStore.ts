import { ref } from "vue";
import { Store, Parser } from "n3";

const defaultPrefixes: {[token: string]: string} = {
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
    function parseIntoStore(s: string) {
        s = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + s; // temp fix for missing rdf: prefix from API
        const p = parser.parse(s, null, (prefixName, prefixNode) => {
            // callback for each prefix parsed
            if (!Object.values(defaultPrefixes).includes(prefixNode.value)) {
                prefixes.value[prefixName] = prefixNode.value;
            }
            // const newPrefixes = Object.keys(parser._prefixes).filter(key => !Object.values(defaultPrefixes).includes(parser._prefixes[key]));
            // prefixes.value = {...prefixes.value, ...newPrefixes};
        });
        store.value.addQuads(p);
    }

    /**
     * Interprets a predicate qname into its full IRI
     * 
     * Note: must be called after `parseIntoStore()`
     * 
     * @param {String} s qname string
     * @returns Predicate IRI string
     */
    function qname(s: string) {
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