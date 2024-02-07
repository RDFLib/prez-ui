import { expect, it } from "vitest";
import { useRdfStore } from "@/composables/rdfStore";

it("parseIntoStore", () => {
    const { store, parseIntoStore } = useRdfStore();
    parseIntoStore(`PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        <https://example.com/someConcept> a skos:Concept .`);
    expect(store.value.size).toBe(1);
});
