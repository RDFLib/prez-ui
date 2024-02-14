// to be moved to prez-lib

import { PrezLiteral, PrezNode } from "prez-lib";

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
    } else if (a.curie && b.curie) {
        return direction === "asc" ? a.curie.localeCompare(b.curie) : b.curie.localeCompare(a.curie);
    } else if (a.curie) {
        return direction === "asc" ? -1 : 1;
    } else if (b.curie) {
        return direction === "asc" ? 1 : -1;
    } else {
        return direction === "asc" ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value);
    }
};

// export function sortTerms<T extends PrezNode | PrezLiteral>(a: T, b: T, direction: "asc" | "desc"): number {

// }