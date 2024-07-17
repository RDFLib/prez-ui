import { PrezTerm, PrezItem, PrezProperties, PrezDataItem, PrezDataList, PrezDataSearch, PrezData, PrezList } from "prez-lib";

export interface PrezUIProps {
    debug?: boolean;
    info?: any;
    theme?: string;
    notheme?: boolean;
}

export interface PrezUIPaginationProps extends PrezUIProps {
    variant?: 'default' | 'endless'
    totalCount: number;
    page: number;
    rows: number;
};

export interface PrezUILinkProps extends PrezUIProps {
    /** the link href to use, internal links may be controlled */
    href: string;
    /** optional title tooltip to use */
    title?: string;
    /** target window */
    target?: string;

    rel?: string;
};

export interface PrezUIDataProviderProps extends PrezUIProps {
    /** The URL endpoint */
    url?: string; 
    /** Optionally, directly pass the data to be processed */
    data?: object;
    type: 'list' | 'item' | 'search';
};

export interface PrezUIMessageProps extends PrezUIProps {
    severity?: "info" | "error";
    text?: string;
};

export interface PrezUILoadingProps extends PrezUIProps {
    variant?: 'item' | 'list' | 'search';
};

export interface PrezUITermProps extends PrezUIProps {
    term: PrezTerm;
};

export interface PrezUILiteralProps extends PrezUITermProps {
    term: PrezTerm;
};

export interface PrezUINodeProps extends PrezUITermProps {
    term: PrezTerm;
};

export interface ButtonProps {
    color?: "primary" | "secondary";
    size?: "sm" | "lg";
};

export interface PrezUIHeaderProps extends PrezUIProps {
    term: PrezTerm;
};

export interface PrezUIPropertyTableProps extends PrezUIProps {
    term: PrezTerm; // parent term or root focus node
    properties: PrezProperties;
};

export interface PrezUIDataProps extends PrezUIProps {
    data: PrezData;
};

export interface PrezUIDataItemProps extends PrezUIProps {
    item: PrezDataItem;
};

export interface PrezUIItemProps extends PrezUIProps {
    item: PrezItem;
};

export interface PrezUIDataListProps extends PrezUIProps {
    list: PrezDataList;
};

export interface PrezUIListProps extends PrezUIProps {
    list: PrezList;
};

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