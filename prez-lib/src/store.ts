import { Store, Parser, DataFactory, type Quad_Object, type Quad_Subject, type Term } from "n3";
import type { PrezItem, PrezLiteral, PrezNode, PrezTerm } from "./types";
import { ANNOTATION_PREDICATES, DEFAULT_PREFIXES } from "./consts";
import { defaultToIri, defaultFromIri } from "./helpers";
import { node, literal, bnode } from "./factory";
import { PrezProperties } from ".";

const { namedNode } = DataFactory;

/**
 * An in-memory N3.js store containing convenience functions
 */
export class RDFStore {
    public store: Store; // N3
    private parser: Parser; // N3
    public prefixes: { [namespace: string]: string };

    constructor() {
        this.store = new Store();
        this.parser = new Parser();
        this.prefixes = DEFAULT_PREFIXES;
    }

    /**
     * Parses an RDF string in Turtle format into a store
     * 
     * @param s RDF Turtle string
     */
    public load(s: string) {
        s = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" + s; // temp fix for missing rdf: prefix from API
        const p = this.parser.parse(s, null, (prefixName, prefixNode) => {
            // callback for each prefix parsed
            if (!Object.values(DEFAULT_PREFIXES).includes(prefixNode.value)) {
                this.prefixes[prefixName] = prefixNode.value;
            }
        });
        this.store.addQuads(p);
    }

    /**
     * Interprets a predicate curie into its full IRI
     * 
     * Note: must be called after `load()`
     * 
     * @param s curie string
     * @returns Predicate IRI string
     */
    public toIri(s: string): string {
        return defaultToIri(s, this.prefixes);
    }

    /**
     * Generates a curie from a IRI
     * 
     * Note: must be called after `load()`
     * 
     * @param iri the IRI string
     * @returns Generated curie
     */
    public fromIri(iri: string): string {
        return defaultFromIri(iri, this.prefixes);
    }

    // private traverseRdfList() { }

    // public getRdfList() { }

    // temporary implementation for now
    private getAnnotation(iri: string, annotation: "label" | "description" | "provenance"): PrezLiteral | undefined {
        return this.getObjects(iri, ANNOTATION_PREDICATES[annotation]).map(o => this.toPrezTerm(o) as PrezLiteral)[0] || undefined;
    }

    /**
     * Gets the preferred label of an object
     * 
     * @param iri 
     * @returns the label
     */
    public getLabel(iri: string): PrezLiteral | undefined {
        return this.getAnnotation(iri, "label");
    }

    /**
     * Gets the preferred description of an object
     * 
     * @param iri 
     * @returns the description
     */
    public getDescription(iri: string): PrezLiteral | undefined {
        return this.getAnnotation(iri, "description");
    }

    /**
     * Gets the preferred provenance of an object
     * 
     * @param iri 
     * @returns the provenance
     */
    public getProvenance(iri: string): PrezLiteral | undefined {
        return this.getAnnotation(iri, "provenance");
    }

    public getProperties(term: Term): PrezProperties {
        const props: PrezProperties = {};

        this.store.forEach(q => {
            props[q.predicate.value] ??= {
                predicate: this.toPrezTerm(q.predicate) as PrezNode,
                objects: []
            };

            props[q.predicate.value].objects.push(this.toPrezTerm(q.object));
        }, term, null, null, null);

        return props;
    }

    private toPrezTerm(term: Term): PrezTerm {
        switch (term.termType) {
            case "NamedNode":
                const n = node(term.value);

                const label = this.getLabel(term.value);
                if (label) {
                    n.label = label;
                }

                const description = this.getDescription(term.value);
                if (description) {
                    n.description = description;
                }

                const provenance = this.getProvenance(term.value);
                if (provenance) {
                    n.provenance = provenance;
                }

                const links = this.getObjects(term.value, this.toIri("prez:link"));
                if (links.length > 0) {
                    n.links = links.map(l => {
                        return { value: l.value }
                    });
                }

                // types

                // curie

                return n;
            case "Literal":
                const l = literal(term.value);

                if (term.datatype) {
                    l.datatype = this.toPrezTerm(term.datatype) as PrezNode;
                }

                if (term.language) {
                    l.language = term.language;
                }

                return l;
            case "BlankNode":
                const b = bnode(term.value);

                b.properties = this.getProperties(term);

                return b;
            default:
                throw ("Invalid n3 Term object")
        }
    }

    /**
     * Gets an array of N3 `Quad_Objects` from a `Store` by providing a predicate or an array of predicates
     * 
     * @param predicate a string or string array of predicate IRIs
     * @param object the object IRI
     * @returns the array of objects
     */
    public getSubjects(predicate: string, object: string): Quad_Subject[] {
        return this.store.getSubjects(predicate, object, null);
    }

    /**
     * Gets an array of N3 `Quad_Objects` from a `Store` by providing a predicate or an array of predicates
     * 
     * @param subject the subject IRI
     * @param predicate a string or string array of predicate IRIs
     * @returns the array of objects
     */
    public getObjects(subject: string, predicate: string | string[]): Quad_Object[] {
        if (typeof predicate === "string") {
            return this.store.getObjects(namedNode(subject), namedNode(predicate), null);
        } else {
            const objs: Quad_Object[] = [];
            predicate.forEach(p => {
                objs.push(...this.store.getObjects(namedNode(subject), namedNode(p), null));
            });
            return objs;
        }
    }

    /**
     * Returns a list of item objects
     * 
     * @param baseClass the object type to return
     * @returns a list of item objects
     */
    public getList(baseClass: string): PrezItem[] {
        const items: PrezItem[] = [];
        // TODO: need to check for top-level base class to determine whether to use getSubjects() or getObjects()

        // top-level objects
        const objs = this.getSubjects(this.toIri("a"), this.toIri(baseClass));
        objs.forEach(obj => {
            const item: PrezItem = {
                focusNode: this.toPrezTerm(obj) as PrezNode,
                properties: this.getProperties(obj)
            }

            items.push(item);
        });
        return items;
    }

    /**
     * Returns an item object
     * 
     * @param baseClass the object type to return
     * @returns the item object
     */
    public getItem(baseClass: string): PrezItem {
        const obj = this.getSubjects(this.toIri("a"), this.toIri(baseClass))[0];
        const item: PrezItem = {
            focusNode: this.toPrezTerm(obj) as PrezNode,
            properties: this.getProperties(obj)
        }
        return item;
    }
};
