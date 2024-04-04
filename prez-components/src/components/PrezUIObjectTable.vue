<script lang="ts" setup>
import { computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { PrezUIObjectTableProps } from "../types"
import { HIDDEN_PREDICATES } from "../util/consts";
import PrezUINode from "./PrezUINode.vue";
import PrezUITerm from "./PrezUITerm.vue";
import PrezUIConceptHierarchy from "./PrezUIConceptHierarchy.vue";
import { literal, node } from "prez-lib";

const props = withDefaults(defineProps<PrezUIObjectTableProps>(), {
    hideHidden: true
});

const properties = computed(() => {
    let p = Object.values(props.properties);
    if (props.hideHidden) {
        p = p.filter(p => !HIDDEN_PREDICATES.includes(p.predicate.value));
    }

    // put fake "members" row at the end
    if (props.members) {
        p.push({
            predicate: node({
                value: "https://prez.dev/members",
                label: literal("Members")
            }),
            objects: props.members.map(m => literal(m.link))
        });
    }

    // put fake "concepts" row at the end
    if (props.concepts) {
        p.push({
            predicate: node({
                value: "https://prez.dev/concepts",
                label: literal("Concepts")
            }),
            objects: props.concepts
        });
    }

    return p;
});
</script>

<template>
    <DataTable :value="properties" stripedRows tableStyle="min-width: 50rem">
        <Column field="predicate" headerStyle="display: none;" bodyStyle="min-width: 180px;">
            <template #body="slotProps">
                <PrezUINode v-bind="slotProps.data.predicate" :showType="false" />
            </template>
        </Column>
        <Column field="object" headerStyle="display: none;">
            <template #body="slotProps">
                <template v-if="slotProps.data.predicate.value === 'https://prez.dev/concepts'">
                    <PrezUIConceptHierarchy :concepts="slotProps.data.objects" />
                </template>
                <template v-else-if="slotProps.data.predicate.value === 'https://prez.dev/members'">
                    <RouterLink v-for="member in slotProps.data.objects" :to="member.value">
                        <Button size="small" outlined>Members</Button>
                    </RouterLink>
                </template>
                <template v-else>
                    <PrezUITerm v-for="o in slotProps.data.objects" v-bind="o" />
                </template>
            </template>
        </Column>
    </DataTable>
</template>

<style lang="scss" scoped>

</style>