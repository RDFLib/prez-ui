import { Store, Parser, DataFactory, type Quad_Object, type Quad_Subject, type Term, type Quad } from "n3";
import type { PrezLiteral, PrezNode, PrezTerm, PrezProperties, PrezSearchResult, PrezFocusNode, PrezLink, PrezConceptSchemeNode, PrezConceptNode, PrezLinkParent, PrezNodeList, PrezFacet } from "./types";
import { DEFAULT_PREFIXES, PREZ_PREDICATES, SYSTEM_PREDICATES } from "./consts";
import { defaultToIri, defaultFromIri } from "./helpers";
import { node, literal, bnode } from "./factory";
import * as RDF from "@rdfjs/types";

const { namedNode } = DataFactory;

/**
 * An in-memory N3.js store containing convenience functions
 */
export class RDFStore {
    public store: Store; // N3
    private parser: Parser; // N3
    public prefixes: { [namespace: string]: string };
    private basePath: string;
    // @ts-ignore - incorrectly warns unused
    private baseUrl: string;
    private linkedLists: Record<string, RDF.Term[]>;
    private lists: Record<string, PrezNodeList[]>;

    constructor() {
        this.store = new Store();
        this.baseUrl = '';
        this.basePath = '';
        this.parser = new Parser();
        this.prefixes = DEFAULT_PREFIXES;
        this.linkedLists = {};
        this.lists = {};
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
        this.linkedLists = this.store.extractLists();
        this.buildLists();
    }

    /** build the top level node array from a linked list */
    public buildLists() {
        this.lists = {}; // Reset processed lists
        const rawLinkedLists = this.linkedLists; // Keep reference if needed for debugging

        // Find blank nodes that are objects of sh:path
        this.store.getQuads(null, SYSTEM_PREDICATES.shaclPath, null, null).forEach(pathQuad => {
            const pathObject = pathQuad.object; // This should be the blank node containing sh:union
            if (pathObject.termType === 'BlankNode') {
                // Get properties of this blank node (?bnode sh:union ?listHead)
                const unionQuads = this.store.getQuads(pathObject, SYSTEM_PREDICATES.shaclUnion, null, null);

                if (unionQuads.length > 0) {
                    const listHead = unionQuads[0]!.object; // The object of sh:union should be the list head

                    // Check if this list head exists in our extracted lists
                    if (listHead.termType === 'BlankNode' && listHead.value in rawLinkedLists) {
                        const listItems = rawLinkedLists[listHead.value]!;
                        // Process the list items using buildSubList
                        // We need a key for this.lists. Using the pathQuad subject or the pathObject BNode ID seems reasonable.
                        // Let's use the pathObject BNode ID as it directly relates to the path structure.
                        const listKey = pathObject.value;
                        this.lists[listKey] = this.buildSubList(listItems);
                    } else {
                        console.warn(`[buildLists] Found sh:union for ${pathObject.value}, but its object ${listHead.value} is not a valid list head in linkedLists.`);
                    }
                }
            }
        });
    }

    /** build sub linked lists */
    private buildSubList(list: RDF.Term[]): PrezNodeList[] {
        const items:PrezNodeList[] = [];
        for(const n of list) {
            if(n.termType == "BlankNode") {
                const lid = n.value;
                // Check if this blank node is the head of another list
                if(lid in this.linkedLists) { // Use the originally extracted lists here
                    const subList = this.buildSubList(this.linkedLists[lid]!); // Recursive call
                    // Merging logic
                    if(subList.length > 1) {
                        const existingList = items.find(i => i.node.value == subList[0]!.node.value);
                        if(existingList) {
                            (existingList.list ??= []).push(...subList.slice(1));
                        } else {
                            items.push({node: subList[0]!.node, list: subList.slice(1)});
                        }
                    } else {
                        items.push(...subList);
                    }
                } else {
                    // check for path alias, if found, use that as the node
                    const pathAlias = this.store.getObjects(n, SYSTEM_PREDICATES.shaclPathAlias, null)?.[0];
                    if(pathAlias) {
                        const nn = this.toPrezTerm(pathAlias) as PrezNode;
                        items.push({node: nn, list: []});
                    }
                }
            } else if(n.termType == 'NamedNode') {
                // Skip the sh:union predicate itself if it appears *in* the list
                if(n.value != SYSTEM_PREDICATES.shaclUnion) {
                    const nn = this.toPrezTerm(n as Term) as PrezNode; // Use 'n' directly
                    items.push({node: nn, list: []}); // Assume empty list unless proven otherwise
                }
            }
        }
        return items;
    }

    /**
     * getParents uses the base path to remove the base path from the parent URL (for breadcrumbs)
     * 
     * @param url
     */
    public setBaseUrl(url: string) {
        this.baseUrl = url;
        this.basePath = new URL(url).pathname;
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

    private getObjectLiteral(iri: string, predicate: string, parent?: PrezTerm): PrezLiteral | undefined {
        return this.getObjects(iri, predicate).map(o => this.toPrezTerm(o, parent) as PrezLiteral)[0] || undefined;
    }

    public getProperties(term: Term, options?: {excludePrefix?: string, includePrefix?: string}, parent?: PrezTerm): PrezProperties {
        const props: PrezProperties = {};

        this.store.forEach(q => {
            // apply filter options
            if(options?.excludePrefix && q.predicate.value.startsWith(options.excludePrefix)) return;
            if(options?.includePrefix && !q.predicate.value.startsWith(options.includePrefix)) return;

            props[q.predicate.value] ??= {
                predicate: this.toPrezTerm(q.predicate, parent) as PrezNode,
                objects: []
            };

            props[q.predicate.value]!.objects.push(this.toPrezTerm(q.object, parent));
        }, term, null, null, null);

        if(term.termType === "BlankNode") {

        }

        return props;
    }

    public getParents(link: string) {
        // remove the base path from the link, if the prez API has a base path, e.g. /api/v1
        if(link.startsWith(this.basePath)) {
            link = link.substring(this.basePath.length);
        }
        const linkParts = link.split('/');
        const parents:PrezLinkParent[] = [];
        let current = '';
        for(const part of linkParts) {
            if(part == '') continue;
            current+= '/' + part;
            const parent:PrezLinkParent = {url: current, segment: part};
            if(part.includes(':')) {
                const parts = part.split(':');
                const expanded = this.prefixes[parts[0]!];
                if(expanded) {
                    const findParent = this.getObjects(expanded + parts[1], PREZ_PREDICATES.label);
                    if(findParent.length > 0) {
                        parent.label = literal(findParent[0]!.value);
                    }
                }
            }
            parents.push(parent);
        }
        return parents;
    }

    private toPrezTerm(term: Term, parent?: PrezTerm): PrezTerm {
        
        // Check if this term is already being processed in the call chain to prevent cycles
        if (parent && this.isAncestor(term, parent)) {
            // We've detected a cycle - return a simplified version without recursive processing
            return this.createCycleSafeTerm(term);
        }

        switch (term.termType) {
            case "NamedNode":
                const n = node(term.value);

                (n as PrezTerm)._cycleParent = parent;
                
                n.label = this.getObjectLiteral(term.value, PREZ_PREDICATES.label, n);
                n.description = this.getObjectLiteral(term.value, PREZ_PREDICATES.description, n);
                n.provenance = this.getObjectLiteral(term.value, PREZ_PREDICATES.provenance, n);

                const identifiers = this.getObjects(term.value, PREZ_PREDICATES.identifier);
                if(identifiers.length > 0) {
                    n.identifiers = identifiers.map(t => this.toPrezTerm(t, n));
                }

                const links = this.getObjects(term.value, PREZ_PREDICATES.link);
                if (links.length > 0) {
                    n.links = links.map(l => {
                        return { value: l.value, parents: this.getParents(l.value) }
                    });
                }

                const members = this.getObjects(term.value, PREZ_PREDICATES.members);
                if (members.length > 0) {
                    n.members = { value: members[0]!.value, parents: this.getParents(members[0]!.value) };
                }

                // types
                const types = this.getObjects(term.value, SYSTEM_PREDICATES.a);
                if (types.length > 0) {
                    n.rdfTypes = types.map(t => this.toPrezTerm(t, n) as PrezNode)
                }

                return n;
            case "Literal":
                const l = literal(term.value);
                
                (l as PrezTerm)._cycleParent = parent;

                if (term.datatype) {
                    l.datatype = this.toPrezTerm(term.datatype, l) as PrezNode;
                }

                if (term.language) {
                    l.language = term.language;
                }

                return l;
            case "BlankNode":
                const b = bnode(term.value);
                
                (b as PrezTerm)._cycleParent = parent;

                b.properties = this.getProperties(term, undefined, b);

                // see if this blank node is a list
                if(term.value in this.lists) {
                    b.list = this.lists[term.value];
                }

                return b;
            default:
                throw ("Invalid n3 Term object")
        }
    }

    /**
     * Checks if a term is an ancestor of the parent in the call chain
     */
    private isAncestor(term: Term, parent: PrezTerm): boolean {
        let current: PrezTerm | undefined = parent;
        while (current) {
            if (current.equals(term as PrezTerm)) {
                return true;
            }
            current = current._cycleParent;
        }
        return false;
    }

    /**
     * Creates a cycle-safe version of a term without recursive processing
     */
    private createCycleSafeTerm(term: Term): PrezTerm {
        switch (term.termType) {
            case "NamedNode":
                return node(term.value);
            case "Literal":
                return literal(term.value);
            case "BlankNode":
                return bnode(term.value);
            default:
                throw ("Invalid n3 Term object");
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
        focusNode.properties = this.getProperties(obj, { excludePrefix: PREZ_PREDICATES.namespace }, focusNode);
        focusNode.systemProperties = this.getProperties(obj, { includePrefix: PREZ_PREDICATES.namespace }, focusNode);
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
                    index[b.value]!.push(c);
                }
            });

            const narrower = this.getObjects(c.value, this.toIri("skos:narrower"));
            narrower.forEach(n => {
                if (isInScheme(n)) {
                    index[c.value]!.push(n);
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
        const narrowers = index[c.value]!.map(n => this.createHierarchy(n, index));
        return {
            ...this.toPrezTerm(c) as PrezNode,
            hasChildren: narrowers.length > 0,
            narrowers
        };
    }

    /**
     * Gets a one or more subjects based on having a prez FocusNode identifier
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
        
        if (id) {
            return ids.find(q => q.object.value === id)!.subject;
        } else {
            return ids.map(q => q.subject);
        }
    }

    public getCount(): number {
        const count = this.store.getObjects(null, PREZ_PREDICATES.count, null);
        if (count.length > 0) {
            /** follow up, expected in value without the quotes */
            return Number(count[0]!.value.replace('>', ''));
        } else {
            return 0;
        }
    }

    public getMaxReached(): boolean {
        const count = this.store.getObjects(null, PREZ_PREDICATES.count, null);
        if (count.length > 0) {
            /** follow up, expected in value without the quotes */
            return !count[0]!.value.includes(">");
        } else {
            return false;
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

    public getSkosCollections(vocab: Quad_Object): PrezNode[] {
        const inScheme = this.getSubjects("http://www.w3.org/2004/02/skos/core#inScheme", vocab.value);
        const colls = this.getSubjects("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2004/02/skos/core#Collection").filter(coll => inScheme.find(i => i.value === coll.value));
        const collections = colls.map(c => this.toPrezTerm(c) as PrezNode).sort((a, b) => {
            if (a.label && b.label) {
                return a.label.value.localeCompare(b.label.value);
            } else if (a.label) {
                return -1;
            } else if (b.label) {
                return 1;
            } else {
                return a.value.localeCompare(b.value);
            }
        });

        return collections;
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
        const item = this.toPrezFocusNode(obj[0]!);

        // if conceptscheme
        if (item.rdfTypes?.map(t => t.value).includes(SYSTEM_PREDICATES.skosConceptScheme)) {
            const collections = this.getSkosCollections(obj[0]!);
            return {
                ...item,
                collections,
            } as PrezConceptSchemeNode;

            // const concepts = this.getConcepts(obj[0]!);
            // console.log(concepts)
            // return {
            //     ...item,
            //     topConcepts: {
            //         narrowers: concepts,
            //         hasChildren: concepts.length > 0
            //     }
            // } as PrezConceptSchemeNode;
        }
        
        return item;
    }

    /**
     * Return nested subitems for a given predicate
     * 
     * @param predicate Predicate IRI to lookup
     * @returns 
     */
    public getSubItems(predicate:string) {
        const nodes = this.store.getQuads(null, predicate, null, null);
        const subItems:PrezFocusNode[] = [];
        nodes.forEach(subItem => {
            const node = this.toPrezFocusNode(subItem.object);
            if(node) {
                subItems.push(node);
            }
        });
        return subItems;
    }

    /**
     * Returns search results
     */
    public search(): PrezSearchResult[] {
        const resultSubjects = this.getSubjects(SYSTEM_PREDICATES.a, PREZ_PREDICATES.searchResult);
        const results: PrezSearchResult[] = resultSubjects.map(s => {
            const result: PrezSearchResult = {
                hash: s.value.split("urn:hash:").slice(-1)[0]!,
                weight: Number(this.getObjects(s.value, PREZ_PREDICATES.searchResultWeight)[0]!.value),
                predicate: this.toPrezTerm(this.getObjects(s.value, PREZ_PREDICATES.searchResultPredicate)[0]!) as PrezNode,
                match: this.toPrezTerm(this.getObjects(s.value, PREZ_PREDICATES.searchResultMatch)[0]!) as PrezLiteral,
                resource: this.toPrezFocusNode(this.getObjects(s.value, PREZ_PREDICATES.searchResultURI)[0]!)
            };
            return result;
        });
        return results;
    }


    /**
     * Returns a list of facets
     * 
     * @returns a list of facets
     */
    public getFacets(): PrezFacet[] {
        const facets: PrezFacet[] = [];
        this.store.getQuads(null, PREZ_PREDICATES.facetName, null, null).forEach(q => {
            
            if(q.subject.termType == "BlankNode") {

                const b = bnode(q.subject.value);
                b.properties = this.getProperties(q.subject);
                const count = Number(b.properties?.[PREZ_PREDICATES.facetCount]?.objects?.[0].value) || 0;
                const facetNameObj = b.properties?.[PREZ_PREDICATES.facetName]?.objects?.[0];
                const facetValueObj = b.properties?.[PREZ_PREDICATES.facetValue]?.objects?.[0];

                // Keep the PrezTerm object as facetName
                const facetName = facetNameObj;

                // Find existing facet by comparing the .value (IRI) of the PrezNode
                const facet = facets.find(f => f.facetName.value == facetName?.value);

                if(count > 0 && facetName !== undefined && facetValueObj !== undefined) {
                    // Convert the raw RDF term to a PrezTerm first
                    const prezTerm = this.toPrezTerm(facetValueObj as Term);

                    // *** Check if the term is a Literal or NamedNode before proceeding ***
                    if (prezTerm.termType === 'Literal' || prezTerm.termType === 'NamedNode') {
                        const facetValueAndCount = {
                            // Now prezTerm is guaranteed to be PrezLiteral | PrezNode
                            term: prezTerm,
                            count
                        };

                        if(facet) {
                            facet.facetValues.push(facetValueAndCount); // Type matches PrezFacetValue
                        } else {
                            // Store the PrezNode object directly
                            facets.push({
                                facetName: facetName as PrezNode, // Asserting it's a PrezNode based on usage
                                facetValues: [facetValueAndCount] // Type matches PrezFacetValue
                            });
                        }
                    } else {
                        // Optional: Log if a blank node was encountered as a facet value
                        // console.warn(`Skipping facet value for ${facetName.value} because it resolved to a BlankNode: ${prezTerm.value}`);
                    }
                }
            }
        });
        return facets;
    }    
    
};
