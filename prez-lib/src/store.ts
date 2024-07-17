import { Store, Parser, DataFactory, type Quad_Object, type Quad_Subject, type Term, type Quad } from "n3";
import type { PrezItem, PrezLiteral, PrezNode, PrezTerm, PrezProperties, PrezSearchResult, Concept } from "./types";
import { ANNOTATION_PREDICATES, DEFAULT_PREFIXES } from "./consts";
import { defaultToIri, defaultFromIri } from "./helpers";
import { node, literal, bnode } from "./factory";

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
                const types = this.getObjects(term.value, this.toIri("a"));
                if (types.length > 0) {
                    n.rdfTypes = types.map(t => this.toPrezTerm(t) as PrezNode)
                }

                // curie
                Object.entries(DEFAULT_PREFIXES).forEach(([prefix, namespace]) => {
                    if (term.value.startsWith(namespace)) {
                        n.curie = prefix + ":" + term.value.split("#").slice(-1)[0].split("/").slice(-1)[0];
                    }
                });

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
     * Creates a PrezItem object
     * 
     * @param obj 
     * @returns 
     */
    private toPrezItem(obj: Quad_Object): PrezItem {
        const item: PrezItem = {
            focusNode: this.toPrezTerm(obj) as PrezNode,
            properties: this.getProperties(obj)
        }

        const members = this.getMembers(obj.value);
        if (members.length > 0) {
            item.focusNode.members = members;
        }

        return item;
    }

    /**
     * Gets an array of N3 `Quad_Objects` from a `Store` by providing a predicate or an array of predicates
     * 
     * @param predicate a string or string array of predicate IRIs
     * @param object the object IRI
     * @returns the array of objects
     */
    public getSubjects(predicate: string, object: string | null): Quad_Subject[] {
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

    public getMembers(subject: string): { link: string, label?: string }[] {
        const objs = this.getObjects(subject, this.toIri("prez:members"));
        const members: { link: string, label?: string }[] = [];
        objs.forEach(o => {
            const links = this.getObjects(o.id, this.toIri("prez:link"));
            if (links.length === 1) {
                members.push({
                    link: links[0].value,
                    label: "Members"
                });
            }
        });
        return members;
    }

    /**
     * Returns the concept hierarchy for a vocab
     * 
     * @param vocab 
     * @return the concept hierarchy
     */
    public getConcepts(vocab: Quad_Object): Concept[] {
        const inScheme = this.getSubjects(this.toIri("skos:inScheme"), vocab.value);

        function isInScheme(c: Quad_Object): boolean {
            return inScheme.map(x => x.value).includes(c.value);
        }

        const hasTopConcept = this.getObjects(vocab.value, this.toIri("skos:hasTopConcept"));
        const topConceptOf = this.getObjects(vocab.value, this.toIri("skos:topConceptOf"));
        const index: {[iri: string]: Quad_Object[]} = {}; // an index of IRI's & their narrowers
        const topConcepts = [...hasTopConcept, ...topConceptOf].filter(c => isInScheme(c));
        inScheme.forEach(c => {
            index[c.value] = [];
        });

        inScheme.forEach(c => {
            const broader = this.getObjects(c.value, this.toIri("skos:broader"));
            broader.forEach(b => {
                if (isInScheme(b)) {
                    index[b.value].push(c);
                }
            });

            const narrower = this.getObjects(c.value, this.toIri("skos:narrower"));
            narrower.forEach(n => {
                if (isInScheme(n)) {
                    index[c.value].push(n);
                }
            });
        });

        const concepts: Concept[] = [];

        topConcepts.forEach(c => {
            concepts.push(this.createHierarchy(c, index));
        });
        return concepts;
    }

    private createHierarchy(c: Quad_Object, index: {[iri: string]: Quad_Object[]}): Concept {
        return {
            ...this.toPrezTerm(c) as PrezNode,
            narrowers: index[c.value].map(n => this.createHierarchy(n, index))
        };
    }

    /**
     * Gets a one or more subjects based on having a `dcterms:identifier"..."^^prez:identifier`
     * 
     * @param id optional id to match to get one subject
     * @returns one or more subjects
     */
    getByPrezId(): Quad_Subject[];
    getByPrezId(id: string): Quad_Subject;
    public getByPrezId(id?: string): Quad_Subject | Quad_Subject[] {
        const ids: Quad[] = [];

        this.store.forEach(q => {
            ids.push(q);
        }, null, null, namedNode('https://prez.dev/FocusNode'), null);
            
        // this.store.forEach(q => {
        //     console.log("LOOKUP", q)
        //     if (q.object.termType === "Literal" && q.object.datatype.value === this.toIri("prez:identifier")) {
        //         ids.push(q);
        //     }
        // }, null, namedNode(this.toIri("dcterms:identifier")), null, null);
        if (id) {
            return ids.find(q => q.object.value === id)!.subject;
        } else {
            return ids.map(q => q.subject);
        }
    }

    public getCount(): number {
        const count = this.store.getObjects(null, this.toIri("prez:count"), null);
        if (count.length > 0) {
            return Number(count[0].value);
        } else {
            return 0;
        }
    }

    /**
     * Returns a list of item objects
     * 
     * @returns a list of item objects
     */
    public getList(): PrezItem[] {
        const items: PrezItem[] = [];
        
        // assume only and all list items have dcterms:identifier - can't select by baseClass
        const objs = this.getByPrezId();
        objs.forEach(obj => {
            const item = this.toPrezItem(obj);

            items.push(item);
        });
        return items;
    }

    /**
     * Returns an item object
     * 
     * @param id the id of the object to return
     * @returns the item object
     */
    public getItem(): PrezItem {
        const obj = this.getByPrezId();
        if(obj.length == 0) throw new Error('Unable to find item');
        const item = this.toPrezItem(obj[0]);

        
        console.log("FOCUS", obj[0]);

        // if conceptscheme
        if (item.focusNode.rdfTypes?.map(t => t.value).includes(this.toIri("skos:ConceptScheme"))) {
            const concepts = this.getConcepts(obj[0]);
            if (concepts.length > 0) {
                item.focusNode.concepts = concepts;
            }
        }
        
        return item;
    }

    /**
     * Returns search results
     */
    public search(): PrezSearchResult[] {
        const resultSubjects = this.getSubjects(this.toIri("a"), this.toIri("prez:SearchResult"));
        const results: PrezSearchResult[] = resultSubjects.map(s => {
            const result: PrezSearchResult = {
                hash: s.value.split("urn:hash:").slice(-1)[0],
                weight: Number(this.getObjects(s.value, this.toIri("prez:searchResultWeight"))[0].value),
                predicate: this.toPrezTerm(this.getObjects(s.value, this.toIri("prez:searchResultPredicate"))[0]) as PrezNode,
                match: this.toPrezTerm(this.getObjects(s.value, this.toIri("prez:searchResultMatch"))[0]) as PrezLiteral,
                resource: this.toPrezItem(this.getObjects(s.value, this.toIri("prez:searchResultURI"))[0])
            };
            return result;
        });
        return results;
    }
};
