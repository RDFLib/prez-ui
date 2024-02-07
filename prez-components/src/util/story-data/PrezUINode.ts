import { PrezUINodeProps } from "@/src/types";

// Node
export const node: PrezUINodeProps = {
    iri: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        termType: "literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        termType: "literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        termType: "literal"
    },
    curie: "ex:node1",
    links: [{value: "/node1"}],
    rdfTypes: [
        {
            iri: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                termType: "literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                termType: "literal"
            },
            curie: "ex:type1",
            termType: "node"
        }
    ],
    termType: "node"
};

export const nodePredicate: PrezUINodeProps = {
    iri: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        termType: "literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        termType: "literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        termType: "literal"
    },
    curie: "ex:node1",
    rdfTypes: [
        {
            iri: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                termType: "literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                termType: "literal"
            },
            curie: "ex:type1",
            termType: "node"
        }
    ],
    termType: "node"
};

export const nodeLink: PrezUINodeProps = {
    iri: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        termType: "literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        termType: "literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        termType: "literal"
    },
    curie: "ex:node1",
    links: [{value: "/c/node1"}, {value: "/s/node1"}, {value: "/v/node1"}],
    rdfTypes: [
        {
            iri: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                termType: "literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                termType: "literal"
            },
            curie: "ex:type1",
            termType: "node"
        },
        {
            iri: "https://example.com/type2",
            label: {
                value: "Type 2",
                language: "en",
                termType: "literal"
            },
            description: {
                value: "Desc of type 2",
                language: "en",
                termType: "literal"
            },
            curie: "ex:type1",
            termType: "node"
        }
    ],
    termType: "node"
};