export interface ListItem {
    label?: string;
    uri: string;
    description?: string;
    link?: string;
    extras?: {
        [key: string]: string;
    };
};

export interface ObjectItem {
    label?: string;
    uri: string;
    description?: string;
    link?: string;
    properties: {
        predicate: string;
        object: string;
    }[];
};

// export interface ObjectRowProps {
    
// };

// export interface ObjectTableProps {
//     label?: string;
//     uri: string;
//     types: string[];
//     baseClass: string;
//     description?: string;
//     geometries?: string[];
//     properties: ObjectRowProps[];
// };

// export interface Value {
//     value: string;
//     qname?: string;
//     label?: string;
//     description?: string;
//     provenance?: string;
//     language?: string;
// };

export interface Prefixes {
    [namespace: string]: string;
};

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

export interface Mediatype {
    title: string;
    mediatype: string;
    default: boolean;
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
