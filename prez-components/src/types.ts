import { PrezTerm, PrezItem, PrezProperties, PrezDataItem, PrezDataList, PrezDataSearch, PrezData } from "prez-lib";

interface PrezUIProps {
    debug?: boolean;
    info?: any;
    theme?: string;
}

export interface PrezUITermProps extends PrezUIProps {
    term: PrezTerm;
}

export interface PrezUILiteralProps extends PrezUITermProps {
    term: PrezTerm;
}

export interface PrezUINodeProps extends PrezUITermProps {
    term: PrezTerm;
}

export interface ButtonProps {
    color?: "primary" | "secondary";
    size?: "sm" | "lg";
};

export interface PrezUIHeaderProps extends PrezUIProps {
    term: PrezTerm;
}

export interface PrezUIPropertyTableProps extends PrezUIProps {
    term: PrezTerm; // parent term or root focus node
    properties: PrezProperties;
}

export interface PrezUIDataProps extends PrezUIProps {
    data: PrezData;
}

export interface PrezUIDataItemProps extends PrezUIProps {
    item: PrezDataItem;
}

export interface PrezUIItemProps extends PrezUIProps {
    item: PrezItem;
}

export interface PrezUIDataListProps extends PrezUIProps {
    list: PrezDataList;
}

export interface PrezUIListProps extends PrezUIProps {
    list: PrezItem[];
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