<script lang="ts" setup>
import { ObjectsProps } from "@/types";
import Term from "./Term.vue";

const props = withDefaults(defineProps<ObjectsProps>(), {
    _components: () => {
        return {
            term: Term,
        }
    }
});

</script>

<template>
    <!-- Objects -->
    <slot>
        <div v-for="(obj, index) of props.objects" :key="index" >
            <component
                :is="props._components.term"
                :term="obj"
                :variant="props.variant"
                :renderHtml="props.renderHtml"
                :renderMarkdown="props.renderMarkdown"
            />
        </div>
    </slot>
</template>
