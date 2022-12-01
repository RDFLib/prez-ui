import { ref } from "vue";
import { Store, Writer, DataFactory, Parser } from "n3";

export function useRdfStore() {
    // const { namedNode, literal, defaultGraph, quad } = DataFactory;

    const parser = new Parser();

    const store = ref(new Store());
    const prefixes = ref({
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    });

    /**
     * Parses an RDF string in Turtle format into a store
     * 
     * @param {String} s RDF Turtle string
     */
    function parseIntoStore(s) {
        const p = parser.parse(s);
        store.value.addQuads(p);
        prefixes.value = {...prefixes.value, ...parser._prefixes};
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
        prefixes.value = {
            rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        };
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