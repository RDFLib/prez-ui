import { PrezUIBlankNodeProps } from "@/src/types";
import { nodePredicate } from "./PrezUINode";
import { literalDatatype, literalLang } from "./PrezUILiteral";

// BlankNode
export const blankNode: PrezUIBlankNodeProps = {
    value: "_:1",
    properties: {
        [nodePredicate.value]: {
            predicate: nodePredicate,
            objects: [
                literalLang,
                literalDatatype,
            ],
        }
    },
    termType: "BlankNode"
};