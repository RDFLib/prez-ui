<script lang="ts" setup>
import { computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import { literal, node } from "prez-lib";
import { PrezUIObjectTableProps } from "../types"
import { HIDDEN_PREDICATES } from "../util/consts";
import PrezUINode from "./PrezUINode.vue";
import PrezUITerm from "./PrezUITerm.vue";
import PrezUIConceptHierarchy from "./PrezUIConceptHierarchy.vue";

const props = withDefaults(defineProps<PrezUIObjectTableProps>(), {
    hideHidden: true
});

const properties = computed(() => {
    if (props.data) {
        let p = Object.values(props.data.properties);
        if (props.hideHidden) {
            p = p.filter(p => !HIDDEN_PREDICATES.includes(p.predicate.value));
        }

        // put fake "members" row at the end
        if (props.data.members) {
            p.push({
                predicate: node({
                    value: "https://prez.dev/members",
                    label: literal("Members")
                }),
                objects: props.data.members.map(m => literal(m.link))
            });
        }

        // put fake "concepts" row at the end
        if (props.data.concepts) {
            p.push({
                predicate: node({
                    value: "https://prez.dev/concepts",
                    label: literal("Concepts")
                }),
                objects: props.data.concepts
            });
        }

        return p;
    } else {
        return [];
    }
});

// to use for rendering when "loading"
const placeholderProperties = [
    {
        predicate: "1",
        object: "1"
    },
    {
        predicate: "2",
        object: "2"
    },
    {
        predicate: "3",
        object: "3"
    }
];
</script>

<template>
    <DataTable :value="props.loading ? placeholderProperties : properties" stripedRows tableStyle="min-width: 50rem">
        <Column field="predicate" headerStyle="display: none;" bodyStyle="min-width: 180px;">
            <template #body="slotProps">
                <Skeleton v-if="props.loading" height="1.5rem" width="12rem" class="mb-2"></Skeleton>
                <PrezUINode v-else v-bind="slotProps.data.predicate" :showType="false" />
            </template>
        </Column>
        <Column field="object" headerStyle="display: none;">
            <template #body="slotProps">
                <Skeleton v-if="props.loading" width="30rem" class="mb-2"></Skeleton>
                <template v-else>
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
            </template>
        </Column>
    </DataTable>
</template>
