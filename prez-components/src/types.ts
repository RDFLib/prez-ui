import { ListItem } from "prez-lib";

// for prez-lib
type PrezLiteral = {
    value: string;
    datatype?: PrezNode;
    language?: string;
    rdfType: "literal";
}

type PrezNode = {
    iri: string;
    label?: PrezLiteral;
    description?: PrezLiteral;
    provenance?: PrezLiteral;
    qname?: string;
    links?: string[];
    types?: PrezNode[];
    rdfType: "node";
}

type PrezBlankNode = {
    id: string;
    properties: {
        predicate: PrezNode;
        object: (PrezLiteral | PrezNode | PrezBlankNode)[];
    }[];
    rdfType: "blanknode";
}

export interface PrezUILiteralProps extends PrezLiteral {
    isGeometry?: boolean;
};

export interface PrezUINodeProps extends PrezNode {
    showType?: boolean;
    showProv?: boolean;
};

export interface PrezUIBlankNodeProps extends PrezBlankNode {
    showType?: boolean;
    showProv?: boolean;
};

export interface ListTableProps {
    items: ListItem[];
    predicates?: {
        label: string;
        uri: string;
    }[];
}

export interface ObjectTableProps {
    properties: {
        predicate: string;
        object: string;
    }[];
}
