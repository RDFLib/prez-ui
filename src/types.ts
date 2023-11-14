import type { InjectionKey } from "vue";
import type { Quad_Subject } from "n3";

// env config keys
export const mapConfigKey: InjectionKey<MapConfig> = Symbol();
export const sidenavConfigKey: InjectionKey<boolean> = Symbol();
export const perPageConfigKey: InjectionKey<number> = Symbol();
export const conceptPerPageConfigKey: InjectionKey<number> = Symbol();
export const enabledPrezsConfigKey: InjectionKey<PrezFlavour[]> = Symbol();
export const enableScoresKey: InjectionKey<boolean> = Symbol();
export const apiBaseUrlConfigKey: InjectionKey<string> = Symbol();

// map types
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

// profile types
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

export interface ProfileHeader {
    default: boolean;
    current: boolean;
    uri: string;
    token: string;
    title: string;
    description: string;
    mediatypes: Mediatype[];
};

export interface LinkObject {
    uriRef: string;
    rel: string;
    title: string;
    anchor: string;
    token: string;
    profile: string;
    type: string;
};

export interface Mediatype {
    title: string;
    mediatype: string;
    default: boolean;
};

// page props
export interface ListItem {
    iri: string;
    title?: string;
    description?: string;
    link?: string;
    baseClass?: string;
    types?: {
        value: string;
        qname?: string;
        label?: string;
        description?: string;
    }[];
    childrenCount?: number;
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

export interface Concept {
    iri: string;
    title: string;
    link: string;
    childrenCount: number;
    children: Concept[];
    narrower?: string[];
    broader?: string;
    color?: string;
};

// extending an interface for defineProps in-file causes errors, defined here instead
export interface ConceptProps extends Concept {
    baseUrl: string;
    collapseAll: boolean;
    parentPath: string; // used to find where in hierarchy tree to insert narrowers - parentIRI1|parentIRI2|parentIRI3...
    doNarrowerEmits: boolean;
};

// form types
export type option = {
    title?: string;
    iri: string;
};

export type selectOption = { // for treeselect, will convert option type to this
    id: string;
    label: string;
};

export type treeSelectOption = selectOption & {
    children?: treeSelectOption[];
};

// annotation & PropTable types
export interface AnnotatedTerm {
    id: string;
    value: string;
    termType: "NamedNode" | "Variable" | "Literal" | "BlankNode";
    qname?: string;
    language?: string; // language needs a label? e.g. English, US English, French, etc. (language label will need a language)
    datatype?: {
        value: string;
        label?: string;
        qname?: string;
    };
    label?: string;
    description?: string;
    provenance?: string;
};

export interface AnnotatedPredicate extends Omit<AnnotatedTerm, "language" | "datatype"> {
    termType: "NamedNode" | "Variable"
};

export interface AnnotatedObject extends AnnotatedTerm {};

export interface AnnotatedTriple {
    subject: Quad_Subject,
    predicate: AnnotatedPredicate,
    object: AnnotatedObject
};

export interface Prefixes {
    [namespace: string]: string;
};

export interface PropTableRow extends PropTablePredicate {
    order: number,
    objects: PropTableObject[]
};

export interface PropTablePredicate extends Omit<AnnotatedPredicate, "value"> {
    iri: string;
};

export interface PropTableObject extends AnnotatedObject {
    predicateIri: string;
    rows: PropTableRow[];
};

// misc
export type PrezFlavour = "CatPrez" | "SpacePrez" | "VocPrez";

export interface Breadcrumb {
    name: string,
    url: string
};

export type link = {
    parents: { // ordered - grandparent, parent
        iri: string;
        title?: string;
        link: string;
        types: {
            iri: string;
            title?: string;
        }[];
    }[];
    link: string;
};

export interface ObjectItem {
    uri: string;
    title?: string;
    links: link[];
    description?: string;
    types: {
        uri: string;
        label?: string;
    }[];
};

export interface SearchItem extends ObjectItem { weight: number };
