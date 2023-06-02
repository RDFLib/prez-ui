import type { InjectionKey } from "vue";
import type { Quad } from "n3";

export type PrezFlavour = "CatPrez" | "SpacePrez" | "VocPrez";

export const mapConfigKey: InjectionKey<MapConfig> = Symbol();
export const sidenavConfigKey: InjectionKey<boolean> = Symbol();
export const enabledPrezsConfigKey: InjectionKey<PrezFlavour[]> = Symbol();
export const apiBaseUrlConfigKey: InjectionKey<string> = Symbol();

export interface MapConfig {
    settings: MapSettings,
    search: MapSearchConfig
}

export interface MapSearchConfig {
    spatial: {
        datasetClass: string
        membershipRelationship: string
    },
    props: {
        fId: string
        fLabel: string
        fcLabel: string
        dsLabel: string
    }
}

export interface MapOptionsCenter {
    lat: number;
    lng: number;
}

export interface MapOptions {
    center: MapOptionsCenter;
    streetViewController: boolean;
    zoom: number;
}

export interface MapSettings {
    apiKey: string;
    options: MapOptions;
}

export interface Profile {
    namespace: string;
    token: string;
    title: string;
    description: string;
    mediatypes: string[];
    defaultMediatype: string;
    labelPredicates: string[];
    descriptionPredicates: string[];
    explanationPredicates: string[];
};

export interface Breadcrumb {
    name: string,
    url: string
};

export interface Mediatype {
    title: string;
    mediatype: string;
    default: boolean;
};

export interface ProfileHeader {
    default: boolean;
    uri: string;
    token: string;
    title: string;
    description: string;
    mediatypes: Mediatype[];
}

export interface LinkObject {
    uriRef: string;
    rel: string;
    title: string;
    anchor: string;
    token: string;
    profile: string;
    type: string;
};

export interface ListItem {
    iri: string;
    title?: string;
    description?: string;
    link?: string;
    type?: string;
};

// extra properies for SortableTable display go in extras
export interface ListItemExtra extends ListItem {
    extras: {
        [key: string]: ListItemSortable
    };
}

export interface ListItemSortable {
    label: string;
    iri?: string;
    color?: string;
};

export interface AnnotatedPredicate {
    termType: "NamedNode" | "Variable";
    value: string;
    id: string;
    annotations: Quad[];
};

export interface AnnotatedQuad extends Omit<Quad, "predicate"> {
    predicate: AnnotatedPredicate;
};

export interface RowObj {
    value: string;
    qname?: string;
    datatype?: {
        value: string;
        qname?: string;
    };
    language?: string;
    description?: string;
    termType: string;
    label?: string;
    rows: RowPred[];
};

export interface RowPred {
    iri: string;
    objs: RowObj[];
    qname?: string;
    label?: string;
    description?: string;
    explanation?: string;
    order: number;
};

export interface Concept {
    iri: string;
    title: string;
    link: string;
    children?: Concept[];
    narrower: string[]; // not used here
    broader: string; // not used here
};

// extending an interface for defineProps in-file causes errors, defined here instead
export interface ConceptProps extends Concept {
    baseUrl: string;
    collapseAll: boolean;
};

// export interface PredCellProps extends Omit<RowPred, "order" | "objs"> {};
// Omit doesn't work here?
export interface PredCellProps {
    iri: string;
    qname?: string;
    label?: string;
    description?: string;
    explanation?: string;
};