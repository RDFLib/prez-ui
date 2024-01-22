// import { ListItem } from "prez-lib";

// for prez-lib
export type PrezLiteral = {
    value: string;
    datatype?: PrezNode;
    language?: string;
    rdfType: "literal";
}

export type PrezNode = {
    iri: string;
    label?: PrezLiteral;
    description?: PrezLiteral;
    provenance?: PrezLiteral;
    qname?: string;
    links?: string[];
    types?: PrezNode[];
    rdfType: "node";
}

export type PrezBlankNode = {
    id: string;
    properties: TableProperty[];
    rdfType: "blanknode";
}

export type ItemExtra = PrezNode & {
    extras?: {
        [key: string]: PrezLiteral | PrezNode;
    };
};

type TableProperty = {
    predicate: PrezNode;
    object: (PrezLiteral | PrezNode | PrezBlankNode)[];
};

// ---------------------

export interface PrezUILiteralProps extends PrezLiteral {
    isGeometry?: boolean;
};

export interface PrezUINodeProps extends PrezNode {
    showType?: boolean;
    showProv?: boolean;
};

export interface PrezUIBlankNodeProps extends PrezBlankNode {};

export interface PrezUIItemListProps {
    items: ItemExtra[];
    predicates?: PrezNode[];
    childButton?: {
        suffix: string;
        label: string;
    };
};

export interface PrezUIObjectTableProps {
    properties: TableProperty[];
};

// -------------old--------------

// export interface ListTableProps {
//     items: ListItem[];
//     predicates?: {
//         label: string;
//         uri: string;
//     }[];
// }

// export interface ObjectTableProps {
//     properties: {
//         predicate: string;
//         object: string;
//     }[];
// }
