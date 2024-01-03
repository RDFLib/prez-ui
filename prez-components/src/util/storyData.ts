import { PrezUILiteralProps, PrezUINodeProps, PrezUIBlankNodeProps } from "../types"

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
            predicate: node,
            object: [
                literalLang,
                literalDatatype,
            ],
        }
    ],
    rdfType: "blanknode"
};
