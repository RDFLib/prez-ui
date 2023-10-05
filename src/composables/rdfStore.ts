import { ref } from "vue";
import { Store, Parser } from "n3";
import { DEFAULT_PREFIXES } from "@/util/consts";
import { defaultQnameToIri } from "@/util/helpers";

export function useRdfStore() {
    // const { namedNode, literal, defaultGraph, quad } = DataFactory;

    const parser = new Parser();
    const store = ref(new Store());
    const prefixes = ref(DEFAULT_PREFIXES);

    /**
     * Parses an RDF string in Turtle format into a store
     * 
     * @param {String} s RDF Turtle string
     */
    function parseIntoStore(s: string) {
        s = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + s; // temp fix for missing rdf: prefix from API
        const p = parser.parse(s, null, (prefixName, prefixNode) => {
            // callback for each prefix parsed
            if (!Object.values(DEFAULT_PREFIXES).includes(prefixNode.value)) {
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
    function qnameToIri(s: string): string {
        return defaultQnameToIri(s, prefixes.value);
    }

    /**
     * Generates a qname from an IRI
     * 
     * Note: must be called after `parseIntoStore()`
     * 
     * @param iri the IRI string
     * @returns Generated qname
     */
    function iriToQname(iri: string): string {
        let qname = "";
        Object.entries(prefixes.value).forEach(([prefix, prefixIri]) => {
            if (iri.startsWith(prefixIri)) {
                qname = prefix + ":" + iri.split(prefixIri)[1];
            }
        });
        return qname;
    }

    function clearStore() {
        // clear store
        store.value = new Store();

        // clear prefixes
        prefixes.value = DEFAULT_PREFIXES;
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

    return { store, prefixes, parseIntoStore, qnameToIri, iriToQname, clearStore };
}