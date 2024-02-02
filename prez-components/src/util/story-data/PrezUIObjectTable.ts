import { PrezUIBlankNodeProps, PrezUIObjectTableProps } from "@/src/types";
import { node, nodeLink, nodePredicate } from "./PrezUINode";
import { literalDatatype, literalGeom, literalLang } from "./PrezUILiteral";
import { blankNode } from "./PrezUIBlankNode";

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
