import { ListItem, PrezTerm, PrezLiteral, PrezNode } from "prez-lib";

// having trouble accessing the prez-lib from other locations.
export type UI_PrezLiteral = PrezLiteral;

export interface PrezUITermProps {
    color?: "primary" | "secondary";
    term: PrezTerm;
}

export interface PrezUILiteralProps {
    color?: "primary" | "secondary";
    term: PrezLiteral;
}

export interface PrezUINodeProps {
    color?: "primary" | "secondary";
    size?: "normal" | "small";
    term: PrezNode;
}

export interface ButtonProps {
    color?: "primary" | "secondary";
    size?: "sm" | "lg";
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