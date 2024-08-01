import type { PrezTerm, PrezData, PrezDataTypes, PrezFocusNode, PrezProperty, PrezLiteral, PrezNode } from "prez-lib";

export interface PrezUIProps {
    pt?: object;
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
    maxPagesToSkip?: number;
};

export interface PrezUILinkProps extends PrezUIProps {
    variant?: 'default' | 'breadcrumb';
    /** the link href to use, internal links may be controlled */
    to?: string | PrezNode;
    /** optional title tooltip to use */
    title?: string;
    /** target window */
    target?: string;

    rel?: string;
};

type loadingVariants = 'item' | 'list' | 'search' | 'concept';

export interface PrezUIDataProviderProps extends PrezUIProps {
    /** The URL endpoint */
    url?: string; 
    /** Optionally, directly pass the data to be processed */
    data?: object;
    type: PrezDataTypes;
    loadingVariant?: loadingVariants;
};

export interface PrezUILoadingProps extends PrezUIProps {
    variant?: loadingVariants;
};

export interface PrezUIMessageProps extends PrezUIProps {
    severity?: "info" | "error";
    text?: string;
};

export interface PrezUITermProps extends PrezUIProps {
    term: PrezTerm;
    variant?: 'item' | 'list' | 'item-header' | 'list-header' | 'header';
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

export interface PrezUIItemTablePropertyProps extends PrezUIProps {
    term?: PrezTerm; // parent term or root focus node
    property?: PrezProperty; // property to render
};

export interface PrezUIDataProps extends PrezUIProps {
    data: PrezData;
};

export interface PrezUIItemListProps extends PrezUIProps {
    list: PrezFocusNode[];
};

export interface PrezUIDataConceptProps extends PrezUIProps {
    url: string;
}

export interface PrezUIDataConceptSchemeProps extends PrezUIProps {
    url: string;
    item: PrezFocusNode;
    variant?: 'minimal'|'table';
}

export type PrezUIBreadcrumbItem = {
    label: string | PrezLiteral;
    segment?: string;
    url: string;
}

export interface PrezUIBreadcrumbProps extends PrezUIProps {
    item?: PrezFocusNode;
    customItems?: PrezUIBreadcrumbItem[];
}
