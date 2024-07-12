import { PrezTerm, PrezLiteral, PrezNode, PrezItem, PrezProperties } from "prez-lib";

interface PrezUIProps {
    debug?: boolean;
    info?: any;
    theme?: string;
}

export interface PrezUITermProps extends PrezUIProps {
    term: PrezTerm;
}

export interface PrezUILiteralProps extends PrezUITermProps {
    term: PrezLiteral;
}

export interface PrezUINodeProps extends PrezUITermProps {
    term: PrezNode;
}

export interface ButtonProps {
    color?: "primary" | "secondary";
    size?: "sm" | "lg";
};

export interface PrezUIItemProps extends PrezUIProps {
    item: PrezItem;
}

export interface PrezUIHeaderProps extends PrezUIProps {
    term: PrezTerm;
}

export interface PrezUIPropertyTableProps extends PrezUIProps {
    term: PrezTerm; // parent term
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