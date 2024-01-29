import { PrezUILiteralProps, PrezUINodeProps, PrezUIBlankNodeProps, PrezUIItemListProps, PrezUIObjectTableProps } from "../types"

// Literal
export const literalLang: PrezUILiteralProps = {
    value: "Literal 1",
    language: "en",
    termType: "literal"
};

export const literalDatatype: PrezUILiteralProps = {
    value: "https://example.com/literal2",
    datatype: {
        iri: "http://www.w3.org/2001/XMLSchema#anyURI",
        curie: "xsd:anyURI",
        termType: "node"
    },
    termType: "literal"
};

export const literalGeom: PrezUILiteralProps = {
    value: "POINT((22 22))",
    isGeometry: true,
    datatype: {
        iri: "http://www.opengis.net/ont/geosparql#asWKT",
        curie: "geo:asWKT",
        label: {
            value: "As WKT",
            language: "en",
            termType: "literal"
        },
        description: {
            value: "A description for asWKT",
            language: "en",
            termType: "literal"
        },
        termType: "node"
    },
    termType: "literal"
};

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
    links: ["/node1"],
    types: [
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
    types: [
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
    links: ["/c/node1", "/s/node1", "/v/node1"],
    types: [
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

// BlankNode
export const blankNode: PrezUIBlankNodeProps = {
    id: "_:1",
    properties: [
        {
            predicate: nodePredicate,
            object: [
                literalLang,
                literalDatatype,
            ],
        }
    ],
    termType: "blanknode"
};

// PrezUIItemList
export const listProps: PrezUIItemListProps = {
    items: [
        {
            iri: "https://example.com/ksdjhfjksdhfsdf",
            label: {
                value: "W",
                termType: "literal"
            },
            links: ["/link 1"],
            description: {
                value: "description 1",
                termType: "literal"
            },
            termType: "node"
        },
        {
            iri: "https://example.com/89ok43rikiowefgomsd",
            label: {
                value: "A",
                termType: "literal"
            },
            links: ["/link 2"],
            description: {
                value: "description 2",
                termType: "literal"
            },
            termType: "node",
            extras: {
                "https://example.com/issued": {
                    value: "12-01-2024",
                    termType: "literal"
                }
            }
        },
        {
            iri: "https://example.com/poeidfopohsdnf",
            label: {
                value: "J",
                termType: "literal"
            },
            links: ["/link 3"],
            description: {
                value: "description 3",
                termType: "literal"
            },
            termType: "node",
            extras: {
                "https://example.com/publisher": {
                    iri: "https://example.com/me",
                    label: {
                        value: "me",
                        termType: "literal"
                    },
                    description: {
                        value: "desc",
                        termType: "literal"
                    },
                    termType: "node"
                }
            }
        },
    ],
    predicates: [
        {
            label: {
                value: "Publisher",
                termType: "literal"
            },
            iri: "https://example.com/publisher",
            description: {
                value: "Publisher description",
                termType: "literal"
            },
            termType: "node"
        },
        {
            label: {
                value: "Issued",
                termType: "literal"
            },
            iri: "https://example.com/issued",
            description: {
                value: "Issued description",
                termType: "literal"
            },
            termType: "node"
        },
        {
            label: {
                value: "Created",
                termType: "literal"
            },
            iri: "https://example.com/created",
            description: {
                value: "Created description",
                termType: "literal"
            },
            termType: "node"
        },
    ],
    childButton: {
        suffix: "/items",
        label: "Children"
    }
};

const bnodeNested: PrezUIBlankNodeProps = {
    id: "_:2",
    properties: [
        {
            predicate: nodePredicate,
            object: [
                literalLang,
                literalDatatype,
                blankNode
            ],
        }
    ],
    termType: "blanknode"
};

// PrezUIObjectTable
export const tableProps: PrezUIObjectTableProps = {
    properties: [
        {
            predicate: nodePredicate,
            object: [
                literalLang,
                literalDatatype,
                literalGeom,
                node,
                nodeLink
            ]
        },
        {
            predicate: nodePredicate,
            object: [
                literalLang,
                literalDatatype,
                blankNode
            ]
        },
        {
            predicate: nodePredicate,
            object: [
                literalLang,
                literalDatatype,
                blankNode,
                blankNode,
                blankNode
            ]
        },
        {
            predicate: nodePredicate,
            object: [
                literalLang,
                literalDatatype,
                bnodeNested
            ]
        }
    ]
};
