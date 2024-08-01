<script lang="ts" setup>
import type { PrezUIItemTablePropertyProps } from '../types';
import PrezUITerm from './PrezUITerm.vue';
defineProps<PrezUIItemTablePropertyProps>();
</script>
<template>
    <slot name="property" :property="property" :term="term">
        <tr>
            <th>
                <slot name="predicate" :property="property">
                    <PrezUITerm v-if="property" :term="property.predicate" />
                </slot>
            </th>
            <td>
                <slot v-if="property" name="objects" :property="property">
                    <PrezUITerm 
                        v-for="(obj, index) in property.objects" 
                        :key="index" :term="obj"
                    />
                </slot>
            </td>
        </tr>
    </slot>
</template>
<style scoped>
</style>