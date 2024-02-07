/**
 * Base type for `PrezLiteral`, `PrezNode` & `PrezBlankNode`
 */
export type PrezTerm = {
    termType: "literal" | "node" | "blanknode";
};

/**
 * Represents an RDF Literal
 */
export type PrezLiteral = PrezTerm & {
    value: string;
    datatype?: PrezNode;
    language?: string;
    termType: "literal";
};

/**
 * Represents an RDF Named Node
 */
export type PrezNode = PrezTerm & {
    iri: string;
    label?: PrezLiteral;
    description?: PrezLiteral;
    provenance?: PrezLiteral;
    curie?: string;
    links?: PrezLink[];
    rdfTypes?: PrezNode[];
    termType: "node";
};

/**
 * Represents a `prez:link` value, containing parent info
 */
export type PrezLink = {
    value: string;
    parents?: PrezNode[];
    // maybe label?
};

/**
 * Represents an RDF Blank Node
 */
export type PrezBlankNode = PrezTerm & {
    id: string;
    properties: PrezProperty[];
    termType: "blanknode";
};

/**
 * Represents a 'row' in an item table
 */
export type PrezProperty = {
    predicate: PrezNode;
    object: PrezTerm[];
};

/**
 * Represents a search result
 */
export type PrezSearchResult = {
    hash: string;
    weight: number;
    predicate: PrezNode;
    match: PrezLiteral;
    resource: PrezItem;
};

// to be replaced by PrezItem?
export type ItemExtra = PrezNode & {
    extras?: {
        [key: string]: PrezLiteral | PrezNode;
    };
};

/**
 * 
 */
export interface PrezItem {
    focusNode: PrezNode & {
        members?: {
            link: string;
            label: string;
        }[];
    };
    properties: PrezProperty[];
};
