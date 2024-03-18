import type { PrezNode, PrezLiteral, PrezBlankNode, PrezProperties, PrezItem } from "prez-lib";

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
    members?: string[];
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
