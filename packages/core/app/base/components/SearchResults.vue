<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PrezSearchResult } from '@/base/lib';

interface Props {
  results: PrezSearchResult[];
}

const props = defineProps<Props>();

// Access results from props
const results = props.results;

</script>

<template>
  <!-- SearchResults -->
  <div v-if="results.length">
    <table>
        <tr v-for="result in results.sort((a:PrezSearchResult, b:PrezSearchResult)=>b.weight - a.weight)">
            <td>
                <span class="float-right">
                    tag
                    <div class="text-xs">
                    <Node :term="result.predicate" variant="search-results" />
                    </div>
                </span>
                <b><Term :term="result.resource" variant="search-results" /></b>
                <div v-if="result.resource.description">
                    <Literal class="overflow-hidden text-ellipsis line-clamp-3" 
                    hide-language 
                    :term="result.resource.description" />
                </div>
            </td>
        </tr>
    </table>
  </div>
</template>
