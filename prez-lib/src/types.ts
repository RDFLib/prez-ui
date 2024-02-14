import type { NamedNode, Literal, BlankNode } from "@rdfjs/types";

/**
 * Contains a `PrezLiteral`, `PrezNode` or `PrezBlankNode`
 * @see PrezLiteral
 * @see PrezNode
 * @see PrezBlankNode
 */
export type PrezTerm = PrezLiteral | PrezNode | PrezBlankNode;

/**
 * Represents an RDF Literal
 */
export interface PrezLiteral extends Omit<Literal, "datatype"> {
    /**
     * A PrezNode whose IRI represents the datatype of the literal.
     */
    datatype?: PrezNode;
};

/**
 * Represents an RDF Named Node
 */
export interface PrezNode extends NamedNode {
    /**
     * The node's label
     */
    label?: PrezLiteral;
    /**
     * The node's description
     */
    description?: PrezLiteral;
    /**
     * The node's provenance - used for info about how this node is used in Prez rather than a formal description
     */
    provenance?: PrezLiteral;
    /**
     * The node's curie - a shorthand notation using prefixes - e.g. `prefix:abc`
     */
    curie?: string;
    /**
     * The node's `prez:links`
     */
    links?: PrezLink[];
    /**
     * The node's RDF types
     */
    rdfTypes?: PrezNode[];
    // order: number; // for predicates - new extended type?
};

/**
 * Represents an RDF Blank Node
 */
export interface PrezBlankNode extends BlankNode {
    /**
     * Contains children triples within the blank node
     */
    properties: PrezProperties;
};

/**
 * Represents a `prez:link` value, containing parent info
 */
export type PrezLink = {
    /**
     * The link string value
     */
    value: string;
    /**
     * An ordered array of 'parent' items - e.g. [dataset, feature collection] for a feature
     */
    parents?: PrezNode[];
    // maybe label?
};

/**
 * Represents a 'row' in an item table
 */
export interface PrezProperty {
    predicate: PrezNode;
    objects: PrezTerm[];
};

/**
 * A list of PrezProperty objects indexed by the predicate's IRI
 */
export interface PrezProperties {
    [predicateIri: string]: PrezProperty;
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

/**
 * Represents an item in Prez that contains node info and its related properties
 */
export interface PrezItem {
    focusNode: PrezNode & {
        members?: {
            link: string;
            label: string;
        }[];
    };
    properties: PrezProperties;
};
