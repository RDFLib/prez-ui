import { PrezTerm, PrezProperties, PrezDataItem, PrezDataList, PrezDataSearch, PrezData, PrezDataTypes, PrezConceptNode, PrezFocusNode } from "prez-lib";

export interface PrezUIProps {
    notheme?: boolean;
}

export interface PrezUIPageLayoutProps extends PrezUIProps {
    variant?: 'stacked' | 'sidebar';
}

export interface PrezUIPageHeaderProps extends PrezUIPageLayoutProps {
}

export interface PrezUIPageMenuProps extends PrezUIPageLayoutProps {
}

export interface PrezUIPageFooterProps extends PrezUIPageLayoutProps {
}

export interface PrezUIDataPageProps extends PrezUIPageLayoutProps {
    type: PrezDataTypes;
    url: string;
}

export interface PrezUIPaginationProps extends PrezUIProps {
    variant?: 'default' | 'endless'
    totalCount: number;
    page: number;
    rows: number;
};

export interface PrezUILinkProps extends PrezUIProps {
    /** the link href to use, internal links may be controlled */
    href?: string;
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
    type: PrezDataTypes;
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
    variant?: 'item' | 'list' | 'item-header' | 'list-header';
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

export interface PrezUIItemTableProps extends PrezUIProps {
    term: PrezTerm; // parent term or root focus node
};

export interface PrezUIDataProps extends PrezUIProps {
    data: PrezData;
};

// export interface PrezUIItemProps extends PrezUIProps {
//     item: PrezFocusNode;
// };

// export interface PrezUIDataListProps extends PrezUIProps {
//     list: ;
// };

export interface PrezUIItemListProps extends PrezUIProps {
    list: PrezFocusNode[];
};

export interface PrezUIConceptProps extends PrezUIProps {
    concept: PrezConceptNode;
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