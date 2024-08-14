import type { PrezLinkParent, PrezProfileHeader, PrezTerm, PrezData, PrezDataTypes, PrezFocusNode, PrezProperty, PrezLiteral, PrezNode } from "@/base/lib";
export interface PrezUIProps {
    pt?: object;
}

export interface PaginationProps extends PrezUIProps {
    variant?: 'default' | 'endless'
    totalCount: number;
    page: number;
    rows: number;
    maxPagesToSkip?: number;
};

export interface ItemLinkProps extends PrezUIProps {
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

export interface DataProviderProps extends PrezUIProps {
    /** The base URL, child components may use this for internal data lookups */
    baseUrl?: string;
    /** The URL path, e.g. /catalogs */
    urlPath?: string;
    /** Full URL to use, base and path will be calculated */
    url?: string;
    /** Optionally, directly pass the RDF data to be processed */
    data?: object;
    type: PrezDataTypes;
    loadingVariant?: loadingVariants;
};

export interface LoadingProps extends PrezUIProps {
    variant?: loadingVariants;
};

export interface MessageProps extends PrezUIProps {
    severity?: "info" | "error";
    text?: string;
};

export interface TermProps extends PrezUIProps {
    term: PrezTerm;
    variant?: 'item' | 'list' | 'item-header' | 'list-header' | 'header';
};

export interface LiteralProps extends TermProps {
    term: PrezTerm;
};

export interface NodeProps extends TermProps {
    term: PrezTerm;
};

export interface ButtonProps {
    color?: "primary" | "secondary";
    size?: "sm" | "lg";
};

export interface ItemHeaderProps extends PrezUIProps {
    term: PrezTerm;
};

export interface ItemTableProps extends PrezUIProps {
    /**
     * Optional: The base url for subsequent concept api calls
     */
    baseUrl?: string;
    term: PrezTerm; // parent term or root focus node
};

export interface ItemTablePropertyProps extends PrezUIProps {
    term?: PrezTerm; // parent term or root focus node
    property?: PrezProperty; // property to render
};

export interface DataProps extends PrezUIProps {
    data: PrezData;
};

export interface ItemListProps extends PrezUIProps {
    list: PrezFocusNode[];
};

export interface ConceptProps extends PrezUIProps {
    url: string;
}

export interface ConceptSchemeProps extends PrezUIProps {
    /**
     * Optional: The URL to the concept scheme. If not provided, the URL will be derived from the item
     */
    url?: string;
    /**
     * Optional: The base url to use when constructing the top concept URL
     */
    baseUrl?: string;
    /**
     * The top concept node to determine the top concept URL from
     */
    item?: PrezFocusNode;
    variant?: 'minimal'|'table';
}

export type ItemBreadcrumbPart = {
    label: string | PrezLiteral;
    segment?: string;
    url: string;
}

export interface ItemBreadcrumbProps extends PrezUIProps {
    prepend?: ItemBreadcrumbPart[];
    nameSubstitutions?: Record<string, string>;
    parents?: PrezLinkParent[];
    customItems?: ItemBreadcrumbPart[];
}
