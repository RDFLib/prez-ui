<script lang="ts" setup>
import type { ItemTableProps } from '../types';
import { SYSTEM_PREDICATES, getTopConceptsUrl, type PrezFocusNode } from '@/lib';

const api = useApi();

const props = defineProps<ItemTableProps>();

const term = props.term as PrezFocusNode;
// Handle the button click event
const navigateToMembers = () => {
    try {
        const navigate = useNavigate();
        if(term.members) {
            navigate.to(term.members.value);
    //      router.path = term.members.value;
        }
    } catch (ex) {
        console.error(ex);
    }
};

const isConceptScheme = term.rdfTypes?.find(n=>n.value == SYSTEM_PREDICATES.skosConceptScheme);
const topConceptsUrl = isConceptScheme ? api.getBaseApiUrl() + getTopConceptsUrl(term) : '';

</script>
<template>
    <DataTable v-if="term?.properties" striped-rows :value="Object.keys(term.properties)" table-style="min-width: 50rem">
        <template #body="slotProps">
            <slot name="widget-row" :property="term.properties[slotProps.data]" />
        </template>
        <Column 
            v-for="col of [{field: 'predicate', header: 'Predicate', style: 'width: 1%;white-space:nowrap;'}, {field: 'objects', header: 'Objects', style: ''}]"
            :key="col.field" body="" :style="col.style" v-bind="col" >
            <template #body="slotProps">
                <slot v-if="col.field == 'predicate'" name="widget-predicate" :property="term.properties[slotProps.data]">
                    <Node
                        :term="term.properties[slotProps.data]!.predicate"
                    />
                </slot>
                <slot v-if="col.field == 'objects'" name="widget-objects" :property="term.properties[slotProps.data]">
                    <Term
                        v-for="(obj, index) of term.properties[slotProps.data]!.objects" 
                        :key="index" :term="obj"
                    />
                    
                </slot>
            </template>                    
        </Column>
        <!-- Footer slot for the additional row with the button -->
        <template v-if="term.members || isConceptScheme" #footer>
            <p>
                <Button size="small" color="secondary" label="Members" @click="()=>navigateToMembers()" />
            </p>
            <div v-if="isConceptScheme && topConceptsUrl != ''">
                <p class="concepts">Concepts</p>
                <div>
                    <ConceptScheme :base-url="baseUrl" :url="topConceptsUrl" :item="term" />
                </div>
            </div>
        </template>

    </DataTable>
</template>
<style lang="css" scoped>
p.concepts {
    margin-top:20px;
    font-weight: bold;
}
</style>