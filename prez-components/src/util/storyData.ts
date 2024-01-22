import { PrezUILiteralProps, PrezUINodeProps, PrezUIBlankNodeProps, PrezUIItemListProps, PrezUIObjectTableProps } from "../types"

// Literal
export const literalLang: PrezUILiteralProps = {
    value: "Literal 1",
    language: "en",
    rdfType: "literal"
};

export const literalDatatype: PrezUILiteralProps = {
    value: "https://example.com/literal2",
    datatype: {
        iri: "http://www.w3.org/2001/XMLSchema#anyURI",
        qname: "xsd:anyURI",
        rdfType: "node"
    },
    rdfType: "literal"
};

export const literalGeom: PrezUILiteralProps = {
    value: "POINT((22 22))",
    isGeometry: true,
    datatype: {
        iri: "http://www.opengis.net/ont/geosparql#asWKT",
        qname: "geo:asWKT",
        label: {
            value: "As WKT",
            language: "en",
            rdfType: "literal"
        },
        description: {
            value: "A description for asWKT",
            language: "en",
            rdfType: "literal"
        },
        rdfType: "node"
    },
    rdfType: "literal"
};

// Node
export const node: PrezUINodeProps = {
    iri: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        rdfType: "literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        rdfType: "literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        rdfType: "literal"
    },
    qname: "ex:node1",
    links: ["/node1"],
    types: [
        {
            iri: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                rdfType: "literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                rdfType: "literal"
            },
            qname: "ex:type1",
            rdfType: "node"
        }
    ],
    rdfType: "node"
};

export const nodePredicate: PrezUINodeProps = {
    iri: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        rdfType: "literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        rdfType: "literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        rdfType: "literal"
    },
    qname: "ex:node1",
    types: [
        {
            iri: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                rdfType: "literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                rdfType: "literal"
            },
            qname: "ex:type1",
            rdfType: "node"
        }
    ],
    rdfType: "node"
};

export const nodeLink: PrezUINodeProps = {
    iri: "https://example.com/node1",
    label: {
        value: "Node 1",
        language: "en",
        rdfType: "literal"
    },
    description: {
        value: "Desc 1",
        language: "en",
        rdfType: "literal"
    },
    provenance: {
        value: "Prov 1",
        language: "en",
        rdfType: "literal"
    },
    qname: "ex:node1",
    links: ["/c/node1", "/s/node1", "/v/node1"],
    types: [
        {
            iri: "https://example.com/type1",
            label: {
                value: "Type 1",
                language: "en",
                rdfType: "literal"
            },
            description: {
                value: "Desc of type 1",
                language: "en",
                rdfType: "literal"
            },
            qname: "ex:type1",
            rdfType: "node"
        },
        {
            iri: "https://example.com/type2",
            label: {
                value: "Type 2",
                language: "en",
                rdfType: "literal"
            },
            description: {
                value: "Desc of type 2",
                language: "en",
                rdfType: "literal"
            },
            qname: "ex:type1",
            rdfType: "node"
        }
    ],
    rdfType: "node"
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
    rdfType: "blanknode"
};

// PrezUIItemList
export const listProps: PrezUIItemListProps = {
    items: [
        {
            iri: "https://example.com/ksdjhfjksdhfsdf",
            label: {
                value: "W",
                rdfType: "literal"
            },
            links: ["/link 1"],
            description: {
                value: "description 1",
                rdfType: "literal"
            },
            rdfType: "node"
        },
        {
            iri: "https://example.com/89ok43rikiowefgomsd",
            label: {
                value: "A",
                rdfType: "literal"
            },
            links: ["/link 2"],
            description: {
                value: "description 2",
                rdfType: "literal"
            },
            rdfType: "node",
            extras: {
                "https://example.com/issued": {
                    value: "12-01-2024",
                    rdfType: "literal"
                }
            }
        },
        {
            iri: "https://example.com/poeidfopohsdnf",
            label: {
                value: "J",
                rdfType: "literal"
            },
            links: ["/link 3"],
            description: {
                value: "description 3",
                rdfType: "literal"
            },
            rdfType: "node",
            extras: {
                "https://example.com/publisher": {
                    iri: "https://example.com/me",
                    label: {
                        value: "me",
                        rdfType: "literal"
                    },
                    description: {
                        value: "desc",
                        rdfType: "literal"
                    },
                    rdfType: "node"
                }
            }
        },
    ],
    predicates: [
        {
            label: {
                value: "Publisher",
                rdfType: "literal"
            },
            iri: "https://example.com/publisher",
            description: {
                value: "Publisher description",
                rdfType: "literal"
            },
            rdfType: "node"
        },
        {
            label: {
                value: "Issued",
                rdfType: "literal"
            },
            iri: "https://example.com/issued",
            description: {
                value: "Issued description",
                rdfType: "literal"
            },
            rdfType: "node"
        },
        {
            label: {
                value: "Created",
                rdfType: "literal"
            },
            iri: "https://example.com/created",
            description: {
                value: "Created description",
                rdfType: "literal"
            },
            rdfType: "node"
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
    rdfType: "blanknode"
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
