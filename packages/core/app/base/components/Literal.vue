<script lang="ts" setup>
// Register the directive locally
import { getCurrentInstance } from 'vue';
import { type PrezLiteral, SYSTEM_PREDICATES, treatAsHtml, treatAsMarkdown } from '@/base/lib';
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html';
import { marked } from 'marked';
import mermaid from 'mermaid';

interface Props {
    term: PrezLiteral;
    hideLanguage?: boolean;
    hideDataType?: boolean;
    class?: string;
    textOnly?: boolean;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
}

// Register the directive globally
const vdompurifyHtml = buildVueDompurifyHTMLDirective();
const instance = getCurrentInstance();
if (instance && instance.appContext.app) {
    instance.appContext.app.directive('dompurify-html', vdompurifyHtml);
}

const props = defineProps<Props>();

// test cases
// for autodetection to work, it must be on in the env settings

// props.term.value = 'test with no html or markdown'
// props.term.value = '<b>html test</b> - should auto detect html'
// props.term.value = '<b>markdown test with html</b>\n*markdown title*\nthis is a test with markdown and html, should use markdown renderer'
// props.term.value = '*markdown only*\nthis is a test with markdown only'
// props.term.value = `\`\`\`mermaid
// graph TD;
//     A[Start] --> B{Is it working?};
//     B -- Yes --> C[Great!];
//     B -- No --> D[Try Again];
//     D --> B;
// \`\`\`
// `

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

const isMarkdown = computed(()=>term.datatype?.value == SYSTEM_PREDICATES.w3Markdown || treatAsMarkdown(term.value));
const isHtml = computed(()=>term.datatype?.value == SYSTEM_PREDICATES.w3Html || treatAsHtml(term.value));

// Custom renderer for Mermaid code blocks
const renderer = new marked.Renderer();

// Custom renderer for Mermaid code blocks
renderer.code = ({ text = '', lang = '', escaped = false }) => {
    if (lang === 'mermaid') {
        return `
            <div class="mermaid-container mb-4 mt-4">
                <div class="mermaid">${text}</div>
            </div>
            <script>
                function 
            <\/script>
        `;

/* -- showcode button for mermaid diagrams, needs to be added to the template in away that works with vdompurify-html
                <button onClick="const codeBlock = this.nextElementSibling;const isHidden = codeBlock.classList.contains('hidden');codeBlock.classList.toggle('hidden', !isHidden);this.textContent = isHidden ? 'Hide Code' : 'Show Code';" class="toggle-code-btn px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded mb-2 hover:bg-blue-600">
                    Show Code
                </button>
                <pre class="overflow-x-auto mermaid-code hidden text-xs bg-gray-100 p-4 rounded"><code>${new Option(text).innerHTML}</code></pre>
*/
    }
    return `<pre><code>${text}</code></pre>`;
};

// Process Markdown content if detected
const renderedMarkdownContent = computed(() => {
//    return marked(term.value, { renderer, gfm: true, breaks: true }); // Parse Markdown to HTML
    return marked(term.value, { renderer, gfm: true, breaks: true }); // Parse Markdown to HTML
});

// Initialize Mermaid diagrams after content is rendered
onMounted(async () => {
    if (isMarkdown.value) {
        await nextTick(); // Wait until the DOM is updated
        mermaid.initialize({ startOnLoad: false }); // Disable automatic loading
        mermaid.init(); // Manually initialize Mermaid diagrams
    }
});

const htmlClass = 'no-tailwind' + (props.class ? ' ' + props.class : '');

</script>
<template>
    <!-- Literal -->
    <slot :term="term" :variant="props.variant">
        <!-- Simple text output only -->
        <template v-if="props.textOnly">
            <slot v-if="props?.term?.value" name="text" :term="term" :text="term.value">
                <span v-if="isMarkdown" v-dom-purify-html="renderedMarkdownContent"></span>
                <span v-else-if="isHtml" :class="htmlClass" v-dompurify-html="term.value"></span>
                <span v-else :class="class">{{ term.value }}</span>
            </slot>
        </template>
        <!-- Full output -->
        <span v-else-if="props?.term?.value" class="prezui-literal">
            <span class="prezui-text">
                <slot name="text" :term="term" :text="term.value">
                    <span v-if="isMarkdown" v-dompurify-html="renderedMarkdownContent"></span>
                    <span v-else-if="isHtml" :class="htmlClass" v-dompurify-html="term.value"></span>
                    <span v-else :class="class">{{ term.value }}</span>
                </slot>
                <slot v-if="!hideLanguage && term.language !== undefined" name="language" :term="term" :language="term.language">
                    <div class="pt-1">
                        <Badge :value="term.language" />
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
<style>
.no-tailwind img {
    max-width:100% !important;
    height:auto;
}
</style>
