import { PrezUILiteralProps } from "@/src/types";

export const literalLang: PrezUILiteralProps = {
    value: "Literal 1",
    language: "en",
    termType: "Literal"
};

export const literalDatatype: PrezUILiteralProps = {
    value: "https://example.com/Literal2",
    datatype: {
        value: "http://www.w3.org/2001/XMLSchema#anyURI",
        curie: "xsd:anyURI",
        termType: "NamedNode"
    },
    termType: "Literal"
};

export const literalGeom: PrezUILiteralProps = {
    value: "POINT((22 22))",
    isGeometry: true,
    datatype: {
        value: "http://www.opengis.net/ont/geosparql#asWKT",
        curie: "geo:asWKT",
        label: {
            value: "As WKT",
            language: "en",
            termType: "Literal"
        },
        description: {
            value: "A description for asWKT",
            language: "en",
            termType: "Literal"
        },
        termType: "NamedNode"
    },
    termType: "Literal"
};