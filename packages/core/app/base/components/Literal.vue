<script lang="ts" setup>
import { type PrezLiteral, SYSTEM_PREDICATES } from '@/base/lib';

interface Props {
    term: PrezLiteral;
    hideLanguage?: boolean;
    hideDataType?: boolean;
    class?: string;
    textOnly?: boolean;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
}

const props = defineProps<Props>();

/** set flags initial values */
let hideLanguage = props.hideLanguage || false;
let hideDataType = props.hideDataType || false;
let textOnly = props.textOnly || false;

/** 
 * set variant defaults
 */
switch(props.variant) {
    case 'item-table':
        hideDataType = false;
        break;
    case 'item-list':
        hideDataType = true;
        break;
    case 'item-header':
        hideDataType = true;
        hideLanguage = true;
        break;
    case 'search-results':
        textOnly = true;
        break;
    default:
        break;
}

const term = props.term as PrezLiteral;

/**
 * These datatypes are special and we don't want to show them
 */
if([SYSTEM_PREDICATES.xmlString, SYSTEM_PREDICATES.rdfLangString].indexOf(term.datatype?.value || '') >= 0) {
    hideDataType = true;
}

const htmlClass = 'no-tailwind' + (props.class ? ' ' + props.class : '');

</script>
<template>
    <slot :term="term" :variant="props.variant">
        <!-- Simple text output only -->
        <template v-if="props.textOnly">
            <slot v-if="props?.term?.value" name="text" :term="term" :text="term.value">
                    <span :class="htmlClass" v-if="term.datatype?.value == SYSTEM_PREDICATES.w3Html" v-html="term.value"></span>
                    <span v-else :class="class">{{ term.value }}</span>
            </slot>
        </template>
        <!-- Full output -->
        <span v-else-if="props?.term?.value" class="prezui-literal">
            <span class="prezui-text">
                <slot name="text" :term="term" :text="term.value">
                    <span :class="htmlClass" v-if="term.datatype?.value == SYSTEM_PREDICATES.w3Html" v-html="term.value"></span>
                    <span v-else :class="class">{{ term.value }}</span>
                </slot>
                <slot v-if="!hideLanguage && term.language !== undefined" name="language" :term="term" :language="term.language">
                    <div class="pt-1">
                        <Tag severity="info" :value="term.language" />
                    </div>
                </slot>
                <slot v-if="!hideDataType && term.datatype !== undefined" name="datatype" :term="term" :datatype="term.datatype">
                    <div class="pt-1">
                        <Tag severity="info">
                            <Term 
                                :term="term.datatype"
                            />
                        </Tag>
                    </div>
                </slot>
            </span>
        </span>
    </slot>
</template>
<style scoped>
.prezui-text {
    display: flex;
    justify-content: space-between;
}

.no-tailwind * {
  all: revert;
  font-family: inherit;
  font-size: inherit;
}
</style>
