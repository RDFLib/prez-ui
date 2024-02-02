import { PrezUIBlankNodeProps } from "@/src/types";
import { nodePredicate } from "./PrezUINode";
import { literalDatatype, literalLang } from "./PrezUILiteral";

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