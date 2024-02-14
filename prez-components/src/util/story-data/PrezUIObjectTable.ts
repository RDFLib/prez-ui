import { PrezUIBlankNodeProps, PrezUIObjectTableProps } from "@/src/types";
import { node, nodeLink, nodePredicate } from "./PrezUINode";
import { literalDatatype, literalGeom, literalLang } from "./PrezUILiteral";
import { blankNode } from "./PrezUIBlankNode";

const bnodeNested: PrezUIBlankNodeProps = {
    value: "_:2",
    properties: {
        [nodePredicate.value]: {
            predicate: nodePredicate,
            objects: [
                literalLang,
                literalDatatype,
                blankNode
            ],
        }
        
    },
    termType: "BlankNode"
};

// PrezUIObjectTable
export const tableProps: PrezUIObjectTableProps = {
    properties: {
        [nodePredicate.value]: {
            predicate: nodePredicate,
            objects: [
                literalLang,
                literalDatatype,
                literalGeom,
                node,
                nodeLink
            ]
        },
        [nodePredicate.value]: {
            predicate: nodePredicate,
            objects: [
                literalLang,
                literalDatatype,
                blankNode
            ]
        },
        [nodePredicate.value]: {
            predicate: nodePredicate,
            objects: [
                literalLang,
                literalDatatype,
                blankNode,
                blankNode,
                blankNode
            ]
        },
        [nodePredicate.value]: {
            predicate: nodePredicate,
            objects: [
                literalLang,
                literalDatatype,
                bnodeNested
            ]
        }
    }
};
