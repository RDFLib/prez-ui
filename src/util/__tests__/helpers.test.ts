import { expect, describe, it, bench } from "vitest";
import { setActivePinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import { getLanguagePriority, getAnnotation } from "@/util/helpers";
import { useRdfStore } from "@/composables/rdfStore";
import type { Store } from "n3";

describe("getLanguagePriority", () => {
    it("en-US is the top language", () => {
        setActivePinia(
            createTestingPinia({
                fakeApp: true,
                initialState: {
                    ui: { languageList: ["en-US", "en"] }
                }
            })
        );
        expect(getLanguagePriority("en-US")).toBe(0);
    });
});

describe("getAnnotation", () => {
    let sharedStore: Store;
    
    bench("benchmark", () => {
        getAnnotation("https://example.com/someConcept", "label", sharedStore);
    }, {
        setup: () => {
            setActivePinia(
                createTestingPinia({
                    fakeApp: true,
                    initialState: {
                        ui: { annotationPredicates: { label: ["http://www.w3.org/2000/01/rdf-schema#label"] } }
                    }
                })
            );
    
            const { store, parseIntoStore } = useRdfStore();
            parseIntoStore(`PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                <https://example.com/someConcept> rdfs:label "Some Label .`);
            sharedStore = store.value;
        }
    },);
});
