// import { ListItem } from "prez-lib";

// for prez-lib
export type PrezTerm = {
    termType: "literal" | "node" | "blanknode";
}

export type PrezLiteral = PrezTerm & {
    value: string;
    datatype?: PrezNode;
    language?: string;
    termType: "literal";
}

export type PrezNode = PrezTerm & {
    iri: string;
    label?: PrezLiteral;
    description?: PrezLiteral;
    provenance?: PrezLiteral;
    curie?: string;
    links?: PrezLink[];
    rdfTypes?: PrezNode[];
    termType: "node";
}

export type PrezLink = {
    value: string;
    parents?: PrezNode[];
    // maybe label?
}

export type PrezBlankNode = PrezTerm & {
    id: string;
    properties: PrezProperty[];
    termType: "blanknode";
}

export type ItemExtra = PrezNode & {
    extras?: {
        [key: string]: PrezLiteral | PrezNode;
    };
}

export type PrezProperty = {
    predicate: PrezNode;
    object: PrezTerm[];
}


export interface PrezItem {
    focusNode: PrezNode
    properties: PrezProperty[];
}

export interface PrezList {
    items: PrezItem[];
    count: number;
    title: PrezLiteral;
}

export type PrezSearchResult = {
    hash: string;
    weight: number;
    predicate: PrezNode;
    match: PrezLiteral;
    resource: PrezNode;
};

// ---------------------


export interface PrezUILiteralProps extends PrezLiteral {
    isGeometry?: boolean;
}

export interface PrezUINodeProps extends PrezNode {
    showType?: boolean;
    showProv?: boolean;
}

export interface PrezUIBlankNodeProps extends PrezBlankNode {};


//prez ui library:
export interface PrezUIItemPage {
    item: PrezItem;
    displayProperties?: string[]; // use curies or uris
}

export interface PrezUIListPage {
    list: PrezList;
    displayProperties?: string[]; // use curies or uris
}

export interface NavItemProps {
    label: string;
    route?: string;
    items?: NavItemProps[];
}