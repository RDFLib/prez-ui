import { PrezUINodeProps } from "@/src/types";

// Node
export const node: PrezUINodeProps = {
    value: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        termType: "Literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        termType: "Literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        termType: "Literal"
    },
    curie: "ex:node1",
    links: [{value: "/node1"}],
    rdfTypes: [
        {
            value: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                termType: "Literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                termType: "Literal"
            },
            curie: "ex:type1",
            termType: "NamedNode"
        }
    ],
    termType: "NamedNode"
};

export const nodePredicate: PrezUINodeProps = {
    value: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        termType: "Literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        termType: "Literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        termType: "Literal"
    },
    curie: "ex:node1",
    rdfTypes: [
        {
            value: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                termType: "Literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                termType: "Literal"
            },
            curie: "ex:type1",
            termType: "NamedNode"
        }
    ],
    termType: "NamedNode"
};

export const nodeLink: PrezUINodeProps = {
    value: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        termType: "Literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        termType: "Literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        termType: "Literal"
    },
    curie: "ex:node1",
    links: [{value: "/c/node1"}, {value: "/s/node1"}, {value: "/v/node1"}],
    rdfTypes: [
        {
            value: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                termType: "Literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                termType: "Literal"
            },
            curie: "ex:type1",
            termType: "NamedNode"
        },
        {
            value: "https://example.com/type2",
            label: {
                value: "Type 2",
                language: "en",
                termType: "Literal"
            },
            description: {
                value: "Desc of type 2",
                language: "en",
                termType: "Literal"
            },
            curie: "ex:type1",
            termType: "NamedNode"
        }
    ],
    termType: "NamedNode"
};