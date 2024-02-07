import type { PrezNode, PrezLiteral, PrezBlankNode, PrezProperty, PrezItem, ItemExtra } from "prez-lib";

export interface PrezUILiteralProps extends PrezLiteral {
    isGeometry?: boolean;
};

export interface PrezUINodeProps extends PrezNode {
    showType?: boolean;
    showProv?: boolean;
};

export interface PrezUIBlankNodeProps extends PrezBlankNode { };

export interface PrezUIItemListProps {
    items: ItemExtra[];
    predicates?: PrezNode[];
    childButton?: {
        suffix: string;
        label: string;
    };
};

export interface PrezUIObjectTableProps {
    properties: PrezProperty[];
    members?: string[];
};

// used for both item & list pages
// export interface PrezItem extends PrezNode {
//     properties: PrezProperty[];
//     members: PrezNode[];
// };



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
