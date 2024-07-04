import { PrezTerm, PrezLiteral, PrezNode, PrezItem, PrezProperties } from "prez-lib";

export interface PrezUITermProps {
    debug?: boolean;
    color?: "primary" | "secondary";
    term: PrezTerm;
}

export interface PrezUILiteralProps {
    debug?: boolean;
    color?: "primary" | "secondary";
    term: PrezLiteral;
}

export interface PrezUINodeProps {
    debug?: boolean;
    color?: "primary" | "secondary";
    size?: "normal" | "small";
    term: PrezNode;
}

export interface ButtonProps {
    color?: "primary" | "secondary";
    size?: "sm" | "lg";
};

export interface PrezUIItemProps {
    debug?: boolean;
    item: PrezItem;
}

export interface PrezUIHeaderProps {
    debug?: boolean;
    term: PrezTerm;
}

export interface PrezUIPropertyTableProps {
    debug?: boolean;
    properties: PrezProperties;
}

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