import type { NamedNode, Literal, BlankNode } from "@rdfjs/types";

/**
 * Contains a `PrezLiteral`, `PrezNode` or `PrezBlankNode`
 * @see PrezLiteral
 * @see PrezNode
 * @see PrezBlankNode
 */
export type PrezTerm = PrezLiteral | PrezNode | PrezBlankNode | PrezFocusNode;

/**
 * Represents an RDF Literal
 */
export interface PrezLiteral extends Omit<Literal, "language" | "datatype" | "equals"> {
    /**
     * The language code of the literal, e.g. `en`
     */
    language?: string;
    /**
     * A PrezNode whose IRI represents the datatype of the literal.
     */
    datatype?: PrezNode;
    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "Literal"
     *                   and the same `value`, `language`, and `datatype`.
     */
    equals(other: PrezTerm | null | undefined): boolean;
};

/**
 * Represents an RDF Named Node
 */
export interface PrezNode extends Omit<NamedNode, "equals"> {
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
     * The members belonging to this node
     */
    members?: PrezLink;
    /**
     * The node's RDF types
     */
    rdfTypes?: PrezNode[];

    /**
     * Prez system properties used to populate labels, links, members, etc.
     * All the information here should be available through other properties,
     * but is available as a reference.
     */
    systemProperties?: PrezProperties;

    /**
     * Prez identifiers provide the labels for parent identifiers that can be found in the URL
     */
    identifiers?: PrezTerm[];

    // order: number; // for predicates - new extended type?
    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "NamedNode" and the same `value`.
     */
    equals(other: PrezTerm | null | undefined): boolean;
};

export interface PrezFocusNode extends PrezNode {
    /**
     * The predicate & terms related to this focus node
     */
    properties?: PrezProperties;
}

/**
 * A FocusNode for a Concept Scheme
 */
export interface PrezConceptSchemeNode extends PrezFocusNode {
    /**
     * the top level concepts found under this concept scheme
     */
    topConcepts: PrezConceptNode;
}

/**
 * A recursive list of child concept schemes
 */
export interface PrezConceptNode extends PrezFocusNode {
    /**
     * The narrowers for this concept
     */
    narrowers: PrezConceptNode[];
    /**
     * A boolean indicating if there are narrowers (children)
     */
    hasChildren: boolean;
}


/**
 * Represents an RDF Blank Node
 */
export interface PrezBlankNode extends Omit<BlankNode, "equals"> {
    /**
     * Contains children triples within the blank node
     */
    properties: PrezProperties;

    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "BlankNode" and the same `value`.
     */
    equals(other: PrezTerm | null | undefined): boolean;
};

/**
 * 
 * example: /catalogs/prefix:cat1/collections
 * 
 * labels = the resolved label value of the id
 * segments = the url part for the parent
 * 
 */
export type PrezLinkParent = {
    label?: PrezLiteral;
    segment: string;
    url: string;
}

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
    parents?: PrezLinkParent[];
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
    resource: PrezFocusNode;
};

/**
 * Represents an item in Prez that contains node info and its related properties
 */
/*export interface PrezItem {
    focusNode: PrezNode & {
        members?: {
            link: string;
            label?: string;
        }[];
        concepts?: Concept[];
    };
    properties: PrezProperties;
};

export type PrezList = PrezItem[];
*/
export type Prefixes = {
    [namespace: string]: string;
};

/**
 * Represents a profile as retrieved from the link header from an API response
 */
export type ProfileHeader = {
    default: boolean;
    current: boolean;
    uri: string;
    token: string;
    title: string;
    description: string;
    mediatypes: Mediatype[];
};

export type Mediatype = {
    title: string;
    mediatype: string;
    default: boolean;
};

// Moved to PrezConcept
// export type Concept = PrezNode & {
//     narrowers: Concept[];
// };

export type PrezDataTypes = 'item' | 'list' | 'search';

export interface PrezData {
    type: PrezDataTypes;
    data: PrezFocusNode | PrezFocusNode[] | PrezSearchResult[];
    profiles: ProfileHeader[];
    parents: PrezLinkParent[];
}

export interface PrezDataList extends PrezData {
    type: 'list';
    data: PrezFocusNode[];
    count: number;
}

export interface PrezDataItem extends PrezData {
    type: 'item';
    data: PrezFocusNode | PrezConceptSchemeNode;
}

export interface PrezDataItem extends PrezData {
    type: 'item';
    data: PrezFocusNode | PrezConceptSchemeNode;
}

export interface PrezDataSearch extends PrezData {
    type: 'search';
    data: PrezSearchResult[];
}