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
};

export type PrezBlankNode = PrezTerm & {
    id: string;
    properties: TableProperty[];
    termType: "blanknode";
}

export type ItemExtra = PrezNode & {
    extras?: {
        [key: string]: PrezLiteral | PrezNode;
    };
};

export type TableProperty = {
    predicate: PrezNode;
    object: PrezTerm[];
};

export type PrezSearchResult = {
    hash: string;
    weight: number;
    predicate: PrezNode;
    match: PrezLiteral;
    // resource: PrezNode & {
    //     geometry?: PrezLiteral;
    // };
    resource: PrezItem;
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
    members?: string[];
};

// used for both item & list pages
// export interface PrezItem extends PrezNode {
//     properties: TableProperty[];
//     members: PrezNode[];
// };

export interface PrezItem {
    focusNode: PrezNode & {
        members?: {
            link: string;
            label: string;
        }[];
    };
    properties: TableProperty[];
};

export interface PrezItemPage extends PrezItem {};

export interface PrezListPage {
    items: PrezItem[];
    headers?: PrezNode[];
    // childButton?: {
    //     suffix: string;
    //     label: string;
    // };
};

export interface NavItemProps {
    label: string;
    route?: string;
    items?: NavItemProps[];
};
