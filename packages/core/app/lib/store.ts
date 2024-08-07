import { Store, Parser, DataFactory, type Quad_Object, type Quad_Subject, type Term, type Quad } from "n3";
import type { PrezLiteral, PrezNode, PrezTerm, PrezProperties, PrezSearchResult, PrezFocusNode, PrezLink, PrezConceptSchemeNode, PrezConceptNode, PrezLinkParent } from "./types";
import { ANNOTATION_PREDICATES, DEFAULT_PREFIXES, PREZ_PREDICATES, SYSTEM_PREDICATES } from "./consts";
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
            // callback for each prefix parsed --> no longer using default prefixes
            // if (!Object.values(DEFAULT_PREFIXES).includes(prefixNode.value)) {
            // }
            this.prefixes[prefixName] = prefixNode.value;
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

    private getObjectLiteral(iri: string, predicate: string): PrezLiteral | undefined {
        return this.getObjects(iri, predicate).map(o => this.toPrezTerm(o) as PrezLiteral)[0] || undefined;
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

    public getProperties(term: Term, options?: {excludePrefix?: string, includePrefix?: string}): PrezProperties {
        const props: PrezProperties = {};

        this.store.forEach(q => {
            // apply filter options
            if(options?.excludePrefix && q.predicate.value.startsWith(options.excludePrefix)) return;
            if(options?.includePrefix && !q.predicate.value.startsWith(options.includePrefix)) return;

            props[q.predicate.value] ??= {
                predicate: this.toPrezTerm(q.predicate) as PrezNode,
                objects: []
            };

            props[q.predicate.value].objects.push(this.toPrezTerm(q.object));
        }, term, null, null, null);

        return props;
    }

    public getParents(link: string) {
        const linkParts = link.split('/');
        const parents:PrezLinkParent[] = [];
        let current = '';
        for(const part of linkParts) {
            if(part == '') continue;
            current+= '/' + part;
            const parent:PrezLinkParent = {url: current, segment: part};
            if(part.includes(':')) {
                const parts = part.split(':');
                const expanded = this.prefixes[parts[0]];
                if(expanded) {
                    const findParent = this.getObjects(expanded + parts[1], PREZ_PREDICATES.label);
                    if(findParent.length > 0) {
                        parent.label = literal(findParent[0].value);
                    }
                }
            }
            parents.push(parent);
        }
        return parents;
    }

    private toPrezTerm(term: Term): PrezTerm {
        switch (term.termType) {
            case "NamedNode":
                const n = node(term.value);

                n.label = this.getObjectLiteral(term.value, PREZ_PREDICATES.label);
                n.description = this.getObjectLiteral(term.value, PREZ_PREDICATES.description);
                n.provenance = this.getObjectLiteral(term.value, PREZ_PREDICATES.provenance);

                const identifiers = this.getObjects(term.value, PREZ_PREDICATES.identifier);
                if(identifiers.length > 0) {
                    n.identifiers = identifiers.map(t => this.toPrezTerm(t));
                }

                const links = this.getObjects(term.value, PREZ_PREDICATES.link);
                if (links.length > 0) {
                    n.links = links.map(l => {
                        return { value: l.value, parents: this.getParents(l.value) }
                    });
                }

                const members = this.getObjects(term.value, PREZ_PREDICATES.members);
                if (members.length > 0) {
                    n.members = { value: members[0].value, parents: this.getParents(members[0].value) };
                }

                // types
                const types = this.getObjects(term.value, SYSTEM_PREDICATES.a);
                if (types.length > 0) {
                    n.rdfTypes = types.map(t => this.toPrezTerm(t) as PrezNode)
                }

                // NO LONGER AUTO GENERATE CURIE BASED OFF PASSED PREFIXES, DAVID WILL FIX BY PASSING BACK GOOD DATA
                // curie
//                Object.entries(DEFAULT_PREFIXES).forEach(([prefix, namespace]) => {
                // Object.entries(this.prefixes).forEach(([prefix, namespace]) => {
                //     //const match = term.value.match(/.*[#\/](.*)$/)
                //     if (term.value.startsWith(namespace)) {
                //         n.curie = prefix + ":" + term.value.split("#").slice(-1)[0].split("/").slice(-1)[0];
                //     }
                // });

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
     * Creates a PrezFocusNode object
     * 
     * @param obj 
     * @returns 
     */
    private toPrezFocusNode(obj: Quad_Object): PrezFocusNode {
        const focusNode: PrezFocusNode = this.toPrezTerm(obj) as PrezFocusNode;
        focusNode.properties = this.getProperties(obj, { excludePrefix: PREZ_PREDICATES.namespace });
        focusNode.systemProperties = this.getProperties(obj, { includePrefix: PREZ_PREDICATES.namespace });
        if(focusNode.rdfTypes?.map(t => t.value).includes(SYSTEM_PREDICATES.skosConcept)) {
            (focusNode as PrezConceptNode).hasChildren = focusNode.systemProperties?.[PREZ_PREDICATES.hasChildren]?.objects?.[0]?.value == 'true';
        }
        return focusNode;
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

    public getMembers(subject: string): PrezLink|undefined {
        const objs = this.getObjects(subject, this.toIri("prez:members"));
        objs.forEach(o => {
            return {
                value: o.value,
                parents: []
            }
        });
        return undefined;
    }

    /**
     * Returns the concept hierarchy for a vocab
     * 
     * @param vocab 
     * @return the concept hierarchy
     */
    public getConcepts(vocab: Quad_Object): PrezConceptNode[] {
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

        const concepts: PrezConceptNode[] = [];

        topConcepts.forEach(c => {
            concepts.push(this.createHierarchy(c, index));
        });
        return concepts;
    }

    private createHierarchy(c: Quad_Object, index: {[iri: string]: Quad_Object[]}): PrezConceptNode {
        const narrowers = index[c.value].map(n => this.createHierarchy(n, index));
        return {
            ...this.toPrezTerm(c) as PrezNode,
            hasChildren: narrowers.length > 0,
            narrowers
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
    public getList(): PrezFocusNode[] {
        const items: PrezFocusNode[] = [];
        
        // assume only and all list items have dcterms:identifier - can't select by baseClass
        const objs = this.getByPrezId();
        objs.forEach(obj => {
            items.push(this.toPrezFocusNode(obj));
        });
        return items;
    }

    /**
     * Returns an item object
     * 
     * @param id the id of the object to return
     * @returns the item object
     */
    public getItem(): PrezFocusNode {
        const obj = this.getByPrezId();
        if(obj.length == 0) throw new Error('Unable to find item');
        const item = this.toPrezFocusNode(obj[0]);

        // if conceptscheme
        if (item.rdfTypes?.map(t => t.value).includes(SYSTEM_PREDICATES.skosConcept)) {
            const concepts = this.getConcepts(obj[0]);
            return {
                ...item,
                topConcepts: {
                    narrowers: concepts,
                    hasChildren: concepts.length > 0
                }
            } as PrezConceptSchemeNode;
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
                resource: this.toPrezFocusNode(this.getObjects(s.value, this.toIri("prez:searchResultURI"))[0])
            };
            return result;
        });
        return results;
    }
};
