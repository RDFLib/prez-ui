import type { PrezNode, PrezLiteral, PrezBlankNode, PrezTerm } from "./types";

// custom type guard
export function isTypePrezTerm(obj: any): obj is PrezTerm {
    return obj.value !== undefined;
}

export function node(objOrValue: Omit<PrezNode, "termType" | "equals"> | string): PrezNode {
    const n: PrezNode = {
        value: typeof objOrValue === "string" ? objOrValue : objOrValue.value,
        termType: "NamedNode",
        equals: (other: PrezTerm | null | undefined) => {
            return !!other && n.termType === other.termType && n.value === other.value;
        }
    };

    if (typeof objOrValue !== "string") {
        Object.assign(n, objOrValue);
    }

    return n;
}


export function literal(objOrValue: Omit<PrezLiteral, "termType" | "equals"> | string): PrezLiteral {
    const l: PrezLiteral = {
        value: typeof objOrValue === "string" ? objOrValue : objOrValue.value,
        termType: "Literal",
        equals: (other: PrezTerm | null | undefined) => {
            if (!!other && l.termType === other.termType && l.value === other.value) {
                if (l.language !== other.language) {
                    return false;
                } else if (l.datatype !== other.datatype) {
                    return false;
                } else return true;
            } else return false;
        }
    };

    if (typeof objOrValue !== "string") {
        Object.assign(l, objOrValue);
    }

    return l;
}


export function bnode(objOrValue: Omit<PrezBlankNode, "termType" | "equals"> | string): PrezBlankNode {
    const b: PrezBlankNode = {
        value: typeof objOrValue === "string" ? objOrValue : objOrValue.value,
        properties: {},
        termType: "BlankNode",
        equals: (other: PrezTerm | null | undefined) => {
            return !!other && b.termType === other.termType && b.value === other.value && b.properties === other.properties;
        }
    };

    if (typeof objOrValue !== "string") {
        Object.assign(b, objOrValue);
    }

    return b;
}
