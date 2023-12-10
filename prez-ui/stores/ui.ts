import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", () => {
    const annotationPredicates = ref<{
        label: string[];
        description: string[];
        provenance: string[];
    }>({
        label: [],
        description: [],
        provenance: []
    });

    return {
        annotationPredicates,
    }
});
