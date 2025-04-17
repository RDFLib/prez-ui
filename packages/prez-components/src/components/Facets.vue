<script setup lang="ts">
import { computed } from 'vue';
import type { FacetsProps, FacetsEmits } from '../types'; 
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

// Import Lucide icon
import { ChevronDown } from 'lucide-vue-next';

import Node from "./Node.vue";
import Term from "./Term.vue";
import Literal from "./Literal.vue";
import ItemLink from "./ItemLink.vue";
import { PrezNode, PrezTerm, type PrezFacetValue } from 'prez-lib';

const props = withDefaults(defineProps<FacetsProps>(), {
    _components: () => {
        return {
            node: Node,
            term: Term,
            literal: Literal,
            itemLink: ItemLink,
        }
    }
});

// Define the event that this component can emit
const emit = defineEmits<FacetsEmits>();

// Helper to get the display value for a term (label or value)
const getTermDisplay = (term: PrezTerm) => {
    return (term.termType === 'NamedNode' ? term.label?.value : undefined) || term.value;
};

// Handler function to emit the event
const handleFacetValueClick = (facetName: PrezNode, facetValue: PrezFacetValue) => {
    emit('facet-selected', { facetName, facetValue });
    // Dropdown should close automatically unless prevented elsewhere
};

const computedProfile = computed(() => {
    // use the facet order in the profile, use this to order the facets, but return the facets in the order they are in the profile
    // if the facet is not found in the profile, add it to the end
    return props.facets.sort((a, b) => {
        const aIndex = props.profile.findIndex(p => p.node.value === a.facetName.value);
        const bIndex = props.profile.findIndex(p => p.node.value === b.facetName.value);
        
        // If neither facet is in profile, maintain original order
        if (aIndex === -1 && bIndex === -1) return 0;
        
        // If one facet isn't in profile, put it at the end
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        
        // Both facets in profile, sort by index
        return aIndex - bIndex;
    });
});

</script>

<template>
    <div class="w-full">

        <div v-if="!props.facets || props.facets.length === 0" class="text-muted-foreground text-sm py-2">
        </div>
        <!-- Container for inline facet buttons -->
        <div v-else class="flex flex-wrap gap-2 items-center py-1">
            <!-- Iterate over each facet type -->
            <DropdownMenu v-for="facet in computedProfile" :key="facet.facetName.value">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm" class="inline-flex items-center">
                        <component :is="props._components.term" :term="facet.facetName" />
                        <ChevronDown class="ml-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56 max-h-60 overflow-y-auto">
                    <!-- Iterate over specific values within the facet -->
                    <template v-if="facet.facetValues.length > 0">
                        <DropdownMenuItem
                            v-for="value in facet.facetValues"
                            :key="value.term.value"
                            :inset="false"
                            class="flex justify-between items-center cursor-pointer"
                            :title="getTermDisplay(value.term)"
                            @click="handleFacetValueClick(facet.facetName, value)"
                        >
                             <span class="truncate pr-2">
                                <slot :term="value.term">
                                    <component :is="props._components.term" :term="value.term" />
                                </slot>
                            </span>
                            <span class="text-muted-foreground bg-muted rounded-full px-1.5 py-0 text-xs font-medium ml-2 shrink-0">
                                {{ value.count }}
                            </span>
                        </DropdownMenuItem>
                    </template>
                     <DropdownMenuItem v-else disabled>
                        <span class="text-muted-foreground italic">No values</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
</template>

<style scoped>
/* Add custom scrollbar styles, may need them... */
.max-h-60::-webkit-scrollbar {
    width: 5px;
}
.max-h-60::-webkit-scrollbar-track {
    /* Specify .DEFAULT for the muted color */
    background: theme('colors.muted.DEFAULT'); /* Use muted background color */
    border-radius: 3px;
}
.max-h-60::-webkit-scrollbar-thumb {
    background: theme('colors.border'); /* Use border color */
    border-radius: 3px;
}
.max-h-60::-webkit-scrollbar-thumb:hover {
    background: theme('colors.input'); /* Use input background color on hover */
}
</style>