// to be moved to prez-lib

import { PrezLiteral, PrezNode } from "../types";

export function sortLiterals(a: PrezLiteral, b: PrezLiteral, direction: "asc" | "desc" = "asc"): number {
    return direction === "asc" ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value);
};

export function sortNodes(a: PrezNode, b: PrezNode, direction: "asc" | "desc" = "asc"): number {
    if (a.label && b.label) {
        return direction === "asc" ? a.label.value.localeCompare(b.label.value) : b.label.value.localeCompare(a.label.value);
    } else if (a.label) {
        return direction === "asc" ? -1 : 1;
    } else if (b.label) {
        return direction === "asc" ? 1 : -1;
    } else if (a.qname && b.qname) {
        return direction === "asc" ? a.qname.localeCompare(b.qname) : b.qname.localeCompare(a.qname);
    } else if (a.qname) {
        return direction === "asc" ? -1 : 1;
    } else if (b.qname) {
        return direction === "asc" ? 1 : -1;
    } else {
        return direction === "asc" ? a.iri.localeCompare(b.iri) : b.iri.localeCompare(a.iri);
    }
};

// export function sortTerms<T extends PrezNode | PrezLiteral>(a: T, b: T, direction: "asc" | "desc"): number {

// }