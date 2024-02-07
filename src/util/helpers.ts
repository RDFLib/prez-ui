import type { RouteLocationNormalizedLoaded } from "vue-router";
import { DataFactory, type Store, type Quad, type Quad_Object, type Quad_Predicate } from "n3";
import type { option, link, AnnotatedTerm, Prefixes } from "@/types";
import { useUiStore } from "@/stores/ui";
import { DEFAULT_PREFIXES, CONTAINER_RELATIONS } from "@/util/consts";

const { namedNode } = DataFactory;

/**
 * Periodically checks if the profiles object is set in Pinia before resolving a Promise.
 * 
 * Loops every 500ms, times out after 20s.
 */
export function ensureProfiles() {
    const ui = useUiStore();

    return new Promise<void>((resolve, reject) => {
        let expTimer = setTimeout(reject, 20 * 1000); // time out after 20s
               
        (function waitForProfiles() {
            if (Object.keys(ui.profiles).length > 0) {
                clearTimeout(expTimer);
                return resolve();
            };
            setTimeout(waitForProfiles, 500); // checks every 500ms
        })();
    });
};

/**
 * Copies text to the clipboard
 * 
 * @param text The text to copy to the clipboard
 */
export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text.trim());
}

/**
 * Capitalises the first letter of a string
 * 
 * @param s 
 * @returns 
 */
export function titleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Converts camelCase to Title Case
 * 
 * @param s 
 * @returns 
 */
export function camelToTitleCase(s: string): string {
    const result = s.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Sorts an array of objects alphabetically first, and then by IRI if some elements lack a title
 * 
 * @param a 
 * @param b 
 * @returns 
 */
export const sortByTitle = <T extends {title?: string; iri: string;}>(a: T, b: T): number => {
    if (a.title && b.title) {
        return a.title.localeCompare(b.title);
    } else if (a.title) {
        return -1;
    } else if (b.title) {
        return 1;
    } else {
        return a.iri.localeCompare(b.iri);
    }
};

/**
 * Returns an integer priority based on an RDF literal's language tag
 * 
 * Priority order is: browser language, then exact matches against language config, then partial matches against language config (e.g. `en` => `en-US`), then no language, then everything else
 * 
 * @param language 
 * @returns the priority order as an integer
 */
export function getLanguagePriority(language: string): number {
    const ui = useUiStore();

    if (ui.languageList.includes(language)) {
        return ui.languageList.indexOf(language);
    } else if (language.length === 2 && ui.languageList.find(l => l.startsWith(language))) {
        return ui.languageList.findIndex(l => l.startsWith(language)) + 1;
    } else if (language.length === 5 && ui.languageList.find(l => language.startsWith(l))) {
        return ui.languageList.findIndex(l => language.startsWith(l)) + 1;
    } else if (language === "") {
        return ui.languageList.length + 1;
    } else {
        return ui.languageList.length + 2;
    }
}

/**
 * Get the base class from the URL structure
 * 
 * @param link 
 * @returns 
 */
export function getBaseClassFromLink(link: string): {iri: string; title: string} {
    const curieRegex = "[a-zA-Z0-9\\.\\-_]+:[a-zA-Z0-9\\.\\-_]+";
    const profileRegex = new RegExp(`^(\/[csv])?\/profiles\/${curieRegex}\/?$`);
    const catalogRegex = new RegExp(`^\/c\/catalogs\/${curieRegex}\/?$`);
    const resourceRegex = new RegExp(`^\/c\/catalogs\/${curieRegex}\/resources\/${curieRegex}\/?$`);
    const datasetRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/?$`);
    const featureCollectionRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/collections\/${curieRegex}\/?$`);
    const featureRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/collections\/${curieRegex}\/items\/${curieRegex}\/?$`);
    const vocabRegex = new RegExp(`^\/v\/vocab\/${curieRegex}\/?$`);
    const collectionRegex = new RegExp(`^\/v\/collection\/${curieRegex}\/?$`);
    const conceptRegex = new RegExp(`^\/v\/(vocab|collection)\/${curieRegex}\/${curieRegex}\/?$`);

    switch (true) {
        case profileRegex.test(link):
            return { iri: "http://www.w3.org/ns/dx/prof/Profile", title: "Profile" };
        case catalogRegex.test(link):
            return { iri: "http://www.w3.org/ns/dcat#Catalog", title: "Catalog" };
        case resourceRegex.test(link):
            return { iri: "http://www.w3.org/ns/dcat#Resource", title: "Resource" };
        case datasetRegex.test(link):
            return { iri: "http://www.w3.org/ns/dcat#Dataset", title: "Dataset" };
        case featureCollectionRegex.test(link):
            return { iri: "http://www.opengis.net/ont/geosparql#FeatureCollection", title: "Feature Collection" };
        case featureRegex.test(link):
            return { iri: "http://www.opengis.net/ont/geosparql#Feature", title: "Feature" };
        case vocabRegex.test(link):
            return { iri: "http://www.w3.org/2004/02/skos/core#ConceptScheme", title: "Concept Scheme" };
        case collectionRegex.test(link):
            return { iri: "http://www.w3.org/2004/02/skos/core#Collection", title: "Collection" };
        case conceptRegex.test(link):
            return { iri: "http://www.w3.org/2004/02/skos/core#Concept", title: "Concept" };
        default:
            return { iri: "", title: "" };
    }
}

/**
 * 
 * 
 * @param options 
 * @param selected 
 * @returns 
 */
export function allOptionsSelected(options: option[], selected: string[]): boolean {
    return options.every(option => selected.includes(option.iri));
}

/**
 * Constructs an object containing parent information within a link
 * 
 * @param store the RDF store
 * @param linkQuad the quad containing the `prez:link`
 * @returns the link object
 */
export function getLink(store: Store, linkQuad: Quad): link {
    type linkParent = { // ordered - grandparent, parent
        iri: string;
        title?: string;
        link: string;
        types: {
            iri: string;
            title?: string;
        }[];
    };
    const parents: linkParent[] = [];

    // get matching parents by ID in the link, omitting self
    const parentIds = store.getQuads(null, namedNode(defaultQnameToIri("dcterms:identifier")), null, null).filter(q1 => linkQuad.object.value.slice(0, linkQuad.object.value.lastIndexOf("/")).includes(q1.object.value));

    parentIds.forEach(parentQuad => {
        const parent: linkParent = {
            iri: parentQuad.subject.value,
            link: linkQuad.object.value.split(parentQuad.object.value)[0] + parentQuad.object.value,
            types: [],
            title: getLabel(parentQuad.subject.value, store)
        };

        store.getObjects(namedNode(parentQuad.subject.value), namedNode(defaultQnameToIri("a")), null).forEach(t => {
            parent.types.push({
                iri: t.value,
                title: getLabel(t.value, store),
            });
        });

        parents.push(parent);
    });

    // sort by order of appearance in link
    parents.sort((a, b) => a.link.length - b.link.length);

    return {
        parents: parents,
        link: linkQuad.object.value
    };
}

/**
 * Interprets a predicate qname into its full IRI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param s 
 * @param prefixes 
 * @returns Predicate IRI string
 */
export function defaultQnameToIri(s: string, prefixes: Prefixes = DEFAULT_PREFIXES): string {
    if (s === "a") { // special handling for "a" as rdf:type
        return prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        return prefixes[prefix] + pred;
    }
}

/**
 * Creates a qname from an IRI
 * 
 * Uses the default list of prefixes by default
 * 
 * @param iri 
 * @param prefixes 
 * @returns qname string
 */
export function defaultIriToQname(iri: string, prefixes: Prefixes = DEFAULT_PREFIXES): string {
    let qname = "";
    Object.entries(prefixes).forEach(([prefix, prefixIri]) => {
        if (iri.startsWith(prefixIri)) {
            qname = prefix + ":" + iri.split(prefixIri)[1];
        }
    });
    return qname;
}

/**
 * Creates a query string argument based on a container's base class
 * 
 * @param baseClass 
 * @returns the query string
 */
export function containerQsa(baseClass: string): string {
    return `${CONTAINER_RELATIONS[baseClass].inbound ? 'filter-to-focus' : 'focus-to-filter'}[${CONTAINER_RELATIONS[baseClass].predicate}]`;
}

/**
 * Safely gets the value of a query string argument, or returns `undefined`
 * 
 * @param route vue-router route object from `useRoute()`
 * @param key 
 * @returns the value as a string, or undefined if the key doesn't exist
 */
export function getQSA(route: RouteLocationNormalizedLoaded, key: string): string | undefined {
    if (Object.keys(route.query).length > 0) {
        if (key in route.query) {
            return route.query[key]?.toString();
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

/**
 * Combines the arguments from the current query object with a provided one to create a new query string
 * 
 * @param route vue-router route object from `useRoute()`
 * @param addQSA object representing the new `route.query` object
 * @param removeQSA array of keys to remove from the query string
 * @returns new query string
 */
export function newQSAString(route: RouteLocationNormalizedLoaded, addQSA: {[key: string]: any} = {}, removeQSA: string[] = []): string {
    const queryObj = {...route.query, ...addQSA};
    removeQSA?.forEach(key => {
        if (key in queryObj) {
            delete queryObj[key];
        }
    });
    let queryString = "";
    if (Object.keys(queryObj).length > 0) {
        queryString += "?" + Object.entries(queryObj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    }
    return queryString;
}

/**
 * Gets an RDF list from the N3.js Store
 * 
 * @param store the N3.js Store
 * @param list blank node of the RDF list
 * @returns list of objects
 */
export function getRDFList(store: Store, list: Quad_Object): Quad_Object[] {
    // RDF lists are treated as blank nodes, where they're split into "first" and "rest", except for the last element, which is nil and last element
    let objectList: Quad_Object[] = [];

    /**
     * Recurively traverses an RDF list
     * 
     * @param listNode the blank node representing the RDF list
     */
    function traverseList(listNode: Quad_Object) {
        const first = store.getObjects(listNode, namedNode(defaultQnameToIri("rdf:first")), null)[0];
        const rest = store.getObjects(listNode, namedNode(defaultQnameToIri("rdf:rest")), null)[0];

        objectList.push(first);

        if (rest && rest.value !== defaultQnameToIri("rdf:nil")) { // rest == nil means the end of the list has been reached
            traverseList(rest);
        }
    }

    traverseList(list);

    return objectList;
}

/**
 * Returns the preferred annotation object from a list of potential annotation predicates, using a language-based priority
 * 
 * The priority is to use the annotation predicate with the highest language priority
 * 
 * @param objects the list of annotation objects
 * @returns the preferred annotation object
 */
export function getPreferredAnnotation(objects: { value: string, language: string }[]): { value: string, language: string } {
    const objsWithPriority = objects.map(o => {
        return {...o, priority: getLanguagePriority(o.language)};
    });
    const initialValue = {
        value: "",
        language: "",
        priority: 100
    };
    // get highest priority (lowest value)
    const preferredObj = objsWithPriority.reduce((prev, current) => (prev && prev.priority < current.priority) ? prev : current, initialValue);
    return { value: preferredObj.value, language: preferredObj.language };
}

/**
 * Periodically checks if the annotationPredicates object is set in Pinia before resolving a Promise.
 * 
 * Loops every 200ms, times out after 10s.
 */
export function ensureAnnotationPredicates() {
    const ui = useUiStore();

    return new Promise<void>((resolve, reject) => {
        let expTimer = setTimeout(reject, 10 * 1000); // time out after 10s
               
        (function waitForAnnotationPredicates() {
            if (ui.annotationPredicates.label.length > 0 || ui.annotationPredicates.description.length > 0 || ui.annotationPredicates.provenance.length > 0) {
                clearTimeout(expTimer);
                return resolve();
            };
            setTimeout(waitForAnnotationPredicates, 200); // checks every 200ms
        })();
    });
};

/**
 * Gets an array of N3 `Quad_Objects` from a `Store` by providing an array of predicates
 * 
 * @param subject 
 * @param predicates 
 * @param store 
 * @returns the array of objects
 */
export function getObjects(subject: string, predicates: string[], store: Store): Quad_Object[] {
    const objs: Quad_Object[] = [];

    predicates.forEach(p => {
        objs.push(...store.getObjects(namedNode(subject), namedNode(p), null));
    });

    return objs;
}

/**
 * Gets the preferred annotation of a node if possible
 * 
 * Chooses from a list of supported annotation predicates, gets the highest priority annotation based on language preference
 * 
 * @param iri 
 * @param annotation 
 * @param store 
 * @returns The preferred annotation
 */
export function getAnnotation(iri: string, annotation: "label" | "description" | "provenance", store: Store): { value: string, language: string } {
    const ui = useUiStore();

    const objs = getObjects(iri, ui.annotationPredicates[annotation], store).map(o => {
        return {
            value: o.value,
            language: o.termType === "Literal" ? o.language : ""
        }
    })
    return getPreferredAnnotation(objs);
}

/**
 * Gets the preferred label of a node
 * 
 * @param iri 
 * @param store 
 * @returns 
 */
export function getLabel(iri: string, store: Store): string {
    return getAnnotation(iri, "label", store).value;
};

/**
 * Gets the preferred description of a node
 * 
 * @param iri 
 * @param store 
 * @returns 
 */
export function getDescription(iri: string, store: Store): string {
    return getAnnotation(iri, "description", store).value;
};

/**
 * Gets the preferred provenance of a node
 * 
 * @param iri 
 * @param store 
 * @returns 
 */
export function getProvenance(iri: string, store: Store): string {
    return getAnnotation(iri, "provenance", store).value;
};

/**
 * Creates a generic annotated term object containing all possible preferred annotations
 * 
 * @param term 
 * @param store 
 * @param prefixes 
 * @returns the term containing annotations
 */
export function createAnnotatedTerm<T extends AnnotatedTerm>(term: Quad_Predicate | Quad_Object, store: Store, prefixes?: Prefixes) {
    const annoTerm: T = {
        id: term.id,
        value: term.value
    } as T;

    const termType: T["termType"] = term.termType;
    annoTerm.termType = termType;

    if (term.termType === "NamedNode") {
        annoTerm.qname = defaultIriToQname(term.value, prefixes);
        annoTerm.label = getLabel(term.value, store);
        annoTerm.description = getDescription(term.value, store);
        annoTerm.provenance = getProvenance(term.value, store);

        const links = store.getObjects(namedNode(term.value), namedNode(defaultQnameToIri("prez:link")), null);
        annoTerm.links = links.length > 0 ? links.map(l => l.value) : undefined;
    } else if (term.termType === "Literal") {
        annoTerm.language = term.language;
        annoTerm.datatype = {
            value: term.datatype.value,
            label: getLabel(term.datatype.value, store),
            qname: defaultIriToQname(term.datatype.value, prefixes)
        };
    }

    return annoTerm;
}
