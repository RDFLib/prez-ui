import { PrezUILiteralProps } from "@/src/types";

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