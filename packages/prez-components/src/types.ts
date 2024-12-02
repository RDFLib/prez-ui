import { type HTMLAttributes, type Component } from "vue";
import type { PrezTerm, PrezLiteral, PrezNodeList, PrezNode, PrezSearchResult, PrezLinkParent, PrezFocusNode, PrezProfileHeader, PrezDataTypes } from "prez-lib";
import type { ButtonVariants } from "./components/ui/button";

export interface CopyButtonProps {
    value: string;
    iconOnly?: boolean;
    class?: HTMLAttributes["class"];
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
};

export interface TermProps {
    term: PrezTerm;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    _components?: {
        literal: Component,
        node: Component,
        nodeList: Component,
        itemTable: Component,
        termList: Component,
    };
};

export interface LiteralProps {
    term: PrezLiteral;
    hideLanguage?: boolean;
    hideDataType?: boolean;
    class?: string;
    textOnly?: boolean;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    _components?: {
        term: Component;
    };
};

export interface NodeListProps {
    list: PrezNodeList[];
    level?: number;
    maxLevels?: number;
    _components?: {
        node: Component;
    };
};

export interface NodeProps {
    term: PrezNode;
    hideTooltip?: boolean;
    hideLink?: boolean;
    useExternalLinkOnly?: boolean;
    textOnly?: boolean;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    _components?: {
        itemLink: Component;
    };
};

export interface ItemLinkProps {
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    /** the link href to use or PrezNode to get link info from, internal links may be controlled */
    to?: string | PrezNode;
    /** an override secondary href to include on the secondary link icon, or a PrezNode to get link info from, alternatively this will populate from the ":to" param */
    secondaryTo?: string | PrezNode;
    /** optional title tooltip to use */
    title?: string;
    /** target window for external links */
    target?: string;
    /** rel attribute */
    rel?: string;

    class?: string;
    copyLink?: boolean | string;
    hidePrimaryLink?: boolean;
    hideSecondaryLink?: boolean;
    hideUnderline?: boolean;
    hideTitle?: boolean;
    useSecondaryLinkOnly?: boolean;
    _components?: {
        copyButton: Component;
    };
};

export interface NodeProps {
    term: PrezNode;
    hideTooltip?: boolean;
    hideLink?: boolean;
    useExternalLinkOnly?: boolean;
    textOnly?: boolean;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    _components?: {
        itemLink: Component;
    };
};

export interface TermListProps {
    term: PrezTerm;
    level?: number;
    _components?: {
        node: Component;
        literal: Component;
        nodeList: Component;
    };
};

export interface ItemTableRowProps {
    /** parent term or root focus node */
    term: PrezTerm;
    /** index of the row */
    index: number; 
    /** the main predicate to render */
    predicate: PrezNode;
    /** objects to render */
    objects: PrezTerm[];
    _components?: {
        predicate: Component;
        objects: Component;
    };
};

export interface PredicateProps {
    /** parent term or root focus node */
    term?: PrezTerm;
    /** the main predicate to render */
    predicate: PrezNode;
    /** when rendering a predicate you may access the associated objects */
    objects: PrezTerm[];
    /** tells you the context this predicate is being rendered in */
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    _components?: {
        node: Component;
    };
};

export interface ObjectsProps {
    /** parent term or root focus node */
    term: PrezTerm;
    /** the associated predicate for these objects that are being rendered */
    predicate: PrezNode;
    /** the main set of objects being rendered */
    objects: PrezTerm[];
    /** tells you the context these objects are being rendered in */
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    _components?: {
        term: Component;
    };
};

export interface ItemTableProps {
    /** optional, fields in order to display */
    // fields?: PrezNodeList[];

    /** parent term or root focus node */
    term: PrezTerm;
    _components?: {
        itemTableRow: Component;
    };
};

export interface LoadingProps {
    variant?: 'item' | 'item-table' | 'list' | 'search' | 'concept';
};

export interface MessageProps {
    severity?: "info" | "error";
    text?: string;
};

export interface SearchResultsProps {
    results: PrezSearchResult[];
    _components?: {
        node: Component;
        term: Component;
        literal: Component;
    };
};

export type ItemBreadcrumbPart = {
    label: string | PrezLiteral;
    segment?: string;
    url?: string;
};

export interface ItemBreadcrumbProps {
    prepend?: ItemBreadcrumbPart[];
    nameSubstitutions?: Record<string, string>;
    parents?: PrezLinkParent[];
    customItems?: ItemBreadcrumbPart[];
    _components?: {
        literal: Component;
        itemLink: Component;
    };
};

export interface ItemHeaderProps {
    term: PrezTerm;
    _components?: {
        node: Component;
        literal: Component;
    };
};

export interface ItemListProps {
    /** optional, fields in order to display */
    fields?: PrezNodeList[];
    list: PrezFocusNode[];
    _components?: {
        predicate: Component;
        node: Component;
        objects: Component;
    };
};

export interface ItemProfilesProps {
    apiUrl?: string;
    objectUri?: string;
    profiles?: PrezProfileHeader[];
    loading?: boolean;
    _components?: {
        itemLink: Component;
        loading: Component;
    };
};

export interface DataProviderProps {
    /** The base URL, child components may use this for internal data lookups */
    baseUrl?: string;
    /** The URL path, e.g. /catalogs */
    urlPath?: string;
    /** Full URL to use, base and path will be calculated */
    url?: string;
    /** Optionally, directly pass the RDF data to be processed */
    data?: object;
    type: PrezDataTypes;
    loadingVariant?: LoadingProps["variant"];
    _components?: {
        loading: Component;
        message: Component;
    };
};
