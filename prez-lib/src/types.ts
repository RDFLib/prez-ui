export interface PrezTerm {
    dataType?: PrezNode;
    termType: 'Literal' | 'Node' | 'BlankNode';
}

export interface PrezLiteral extends PrezTerm {
    termType: 'Literal';
    text: string;
    language?: string;
}

export interface PrezNode extends PrezTerm {
    termType: 'Node';
    label?: PrezLiteral;
    description?: PrezLiteral;
    uri: string;
    curie?: string;
}

export interface PrezList {
    class: PrezTerm;
    title?: PrezLiteral;
    description?: PrezLiteral;
    rows: PrezListRow[];
    headers: Record<string, PrezNode>;
}

export interface PrezListRow {
    [key: string]: PrezTerm;
}

export interface PrezObject {
    class: PrezTerm;
    title: PrezLiteral;
    description?: PrezLiteral;
    properties: PrezProperties;
}

// index each property based on their name/curie for simple access
export type PrezProperties = Record<string, PrezProperty>;

export interface PrezProperty {
    predicate: PrezNode;
    object: PrezTerm|PrezTerm[];
}

export interface PrezBlankNode extends PrezTerm {
    termType: 'BlankNode';
    properties: PrezProperties;
}

export const PrezDataFactory = {
    prezNode(paramsOrURI:{uri: string, label?: PrezLiteral|string, description?: PrezLiteral|string, curie?: string}|string): PrezNode {
        if(typeof(paramsOrURI) == 'string') {
            return {
                termType: 'Node',
                uri: paramsOrURI
            }
        }
        const {uri, label, description, curie} = paramsOrURI;
        return {
          termType: 'Node',
          uri,
          curie,
          label: (typeof(label) == 'string' ? this.prezLiteral(label) : label),
          description: (typeof(description) == 'string' ? this.prezLiteral(description) : description),
        };
    },

    prezLiteral(paramsOrString:{text: string, language?: string, dataType?: PrezNode}|string): PrezLiteral {
        if(typeof(paramsOrString) == 'string') {
            return {
                termType: 'Literal',
                text: paramsOrString
            }
        }
        const {text, language, dataType} = paramsOrString;
        return {
            termType: 'Literal',
            text,
            language,
            dataType
        };
    },

    // prezBlankNode(node: PrezProperties): PrezBlankNode {
    //     return {
    //       termType: 'BlankNode',
    //       properties
    //     };
    // }

};





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
