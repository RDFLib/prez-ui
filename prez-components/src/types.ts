import type { PrezNode, PrezLiteral, PrezBlankNode, PrezProperties, PrezItem, Concept } from "prez-lib";

export interface PrezUILiteralProps extends PrezLiteral {
    isGeometry?: boolean;
};

export interface PrezUINodeProps extends PrezNode {
    showType?: boolean;
    showProv?: boolean;
    showDesc?: boolean;
    showExt?: boolean;
    badge?: boolean;
};

export interface PrezUIBlankNodeProps extends PrezBlankNode { };

export type PrezUITermProps = PrezUINodeProps | PrezUILiteralProps | PrezUIBlankNodeProps;

export interface PrezUIItemListProps {
    items: PrezItem[];
};

export interface PrezUIObjectTableProps {
    properties: PrezProperties;
    members?: {
        link: string;
        label?: string;
    }[];
    concepts?: Concept[];
    /**
     * Hide hidden predicates for neater display, defaults to `true`
     */
    hideHidden?: boolean;
};

export interface PrezItemPage extends PrezItem { };

export interface PrezListPage {
    items: PrezItem[];
    headers?: PrezNode[];
    // childButton?: {
    //     suffix: string;
    //     label: string;
    // };
};

export interface NavItemProps {
    label: string;
    route?: string;
    items?: NavItemProps[];
};
