<script lang="ts" setup>
import { type PrezLiteral, SYSTEM_PREDICATES, treatAsHtml, treatAsMarkdown } from '@/base/lib';
import DOMPurify from 'dompurify';
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

const sanitizedHtml = computed(() => DOMPurify.sanitize(props.term.value));
const props = defineProps<Props>();

// test cases
// for autodetection to work, it must be on in the env settings

// props.term.value = 'test with no html or markdown'
// props.term.value = '<b>html test</b> - should auto detect html'
// props.term.value = '<b>markdown test with html</b>\n*markdown title*\nthis is a test with markdown and html, should use markdown renderer'
// props.term.value = '*markdown only*\nthis is a test with markdown only'
// props.term.value = `\`\`\`mermaid
// props.term.value = `<svg xml:space="preserve" id="svg5" version="1.1" viewBox="0 0 136.44925 176.46297" height="176.46297mm" width="136.44925mm" xmlns="http://www.w3.org/2000/svg"><defs id="defs2"></defs><g transform="translate(-35.887163,-36.652497)" id="layer4"><text id="text2865-9-6" y="188.8183" x="153.85579" style="font-size:9.87778px;line-height:0.95;font-family:sans-serif;display:inline;stroke-width:0.264583" xml:space="preserve"><tspan y="188.8183" x="153.85579" style="font-size:9.87778px;stroke-width:0.264583" id="tspan2863-1-6">A'</tspan></text><text id="text2865-3" y="187.53836" x="44.919876" style="font-size:9.87778px;line-height:0.95;font-family:sans-serif;display:inline;stroke-width:0.264583" xml:space="preserve"><tspan y="187.53836" x="44.919876" style="font-size:9.87778px;stroke-width:0.264583" id="tspan2863-6">A</tspan></text><path id="path2988" d="m 78.781406,159.13678 3.810667,21.78708 -3.313623,29.57409 55.9174,0.57989 -3.31362,-13.17166 0.24852,-13.17165 3.72783,-25.1007 z" style="display:inline;fill:#808080;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path><path id="path2986" d="m 63.679396,187.36792 h 85.988544 l -0.24853,-0.0828" style="display:inline;fill:none;stroke:#000000;stroke-width:1.365;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:10.92, 2.73;stroke-dashoffset:2.73;stroke-opacity:1"></path><path id="path3043" d="m 139.25504,160.04803 -3.56214,22.11844 0.0828,2.56806 2.73374,28.24864 v 0 h 0.16568" style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1.32291;stroke-dashoffset:0;stroke-opacity:1"></path><path id="path3071" d="m 135.94142,159.13678 -3.89351,25.76343 -0.0828,13.08881 3.4793,14.16575" style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1.32291;stroke-dashoffset:0;stroke-opacity:1"></path><path id="path3045" d="m 75.799145,158.80542 3.396464,21.86992 -2.982262,30.15398" style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1.32291;stroke-dashoffset:0;stroke-opacity:1"></path><path id="path3069" d="m 78.615727,158.63974 3.893508,21.70424 -3.313626,30.73386" style="fill:none;stroke:#000000;stroke-width:0.265;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1.325;stroke-dashoffset:0;stroke-opacity:1"></path><path id="path3073" d="m 101.72825,210.995 c -0.0869,-10.65802 -1.14435,-21.12191 -2.319536,-31.56227 2.067276,-12.43599 5.898936,-17.95269 9.692356,-19.46754 5.35851,0.42449 9.8857,8.47959 11.59768,13.58586 -0.29305,14.09334 0.64931,25.40701 1.15977,37.69247" style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:1.32291;stroke-dashoffset:0;stroke-opacity:1"></path></g><g transform="translate(-35.887163,-36.652497)" id="layer3"><text id="text2865-9" y="127.34898" x="155.69173" style="font-size:9.87778px;line-height:0.95;font-family:sans-serif;display:inline;stroke-width:0.264583" xml:space="preserve"><tspan y="127.34898" x="155.69173" style="font-size:9.87778px;stroke-width:0.264583" id="tspan2863-1">A'</tspan></text><text id="text2865" y="121.04099" x="45.361439" style="font-size:9.87778px;line-height:0.95;font-family:sans-serif;stroke-width:0.264583" xml:space="preserve"><tspan y="121.04099" x="45.361439" style="font-size:9.87778px;stroke-width:0.264583" id="tspan2863">A</tspan></text><path id="path2802" d="m 58.414551,120.79114 v 19.70856 h 90.923519 v -13.51154 l -0.20318,-0.20319" style="display:inline;fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path><ellipse ry="0.64398128" rx="0.64398146" cy="134.61856" cx="136.5472" id="path2702-0-1" style="display:inline;fill:#0000ff;fill-opacity:1;stroke:#0000ff;stroke-width:0.212037;paint-order:fill markers stroke;stop-color:#000000"></ellipse><ellipse ry="0.64398128" rx="0.64398146" cy="131.26273" cx="78.919647" id="path2702-0-9" style="display:inline;fill:#0000ff;fill-opacity:1;stroke:#0000ff;stroke-width:0.212037;paint-order:fill markers stroke;stop-color:#000000"></ellipse><path id="path2808" d="m 58.312962,120.79114 c 6.877718,6.33882 14.949408,3.98643 19.151718,5.56303 1.474448,1.20418 1.402433,3.41226 1.499413,5.01001 m 57.471977,3.24327 c 5.15023,-2.07652 9.39717,-4.71759 12.902,-7.82248" style="display:inline;fill:none;stroke:#0000ff;stroke-width:0.265;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"></path><path id="path2808-1" d="m 79.021653,131.55678 c 0.983809,-1.7171 7.937791,1.00283 12.365789,0.60191 12.605318,-0.3518 13.460548,-3.28366 19.708558,-3.55567 4.48607,0.82044 6.70364,2.14499 9.44792,3.35249 1.28731,0.33287 2.27655,-0.84214 4.36839,-0.10159 4.51433,0.58971 8.07618,1.75091 11.58132,2.94613" style="display:inline;fill:none;stroke:#0000ff;stroke-width:0.765;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"></path></g><g transform="translate(-35.887163,-36.652497)" id="layer2"><path id="axes" d="M 36.148978,45.113924 V 88.492697 H 171.77994" style="fill:none;stroke:#000000;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"></path><text id="text2522" y="40.940948" x="53.233482" style="font-size:5.64444px;line-height:0.95;font-family:sans-serif;stroke-width:0.264583" xml:space="preserve"><tspan y="40.940948" x="53.233482" style="font-size:5.64444px;stroke-width:0.264583" id="tspan2520">Plane</tspan></text><text id="text2522-0" y="81.037346" x="149.18111" style="font-size:5.64444px;line-height:0.95;font-family:sans-serif;stroke-width:0.264583" xml:space="preserve"><tspan y="81.037346" x="149.18111" style="font-size:5.64444px;stroke-width:0.264583" id="tspan2520-1">Plane</tspan></text><text id="text2522-2" y="46.801338" x="91.782455" style="font-size:5.64444px;line-height:0.95;font-family:sans-serif;stroke-width:0.264583" xml:space="preserve"><tspan y="46.801338" x="91.782455" style="font-size:5.64444px;stroke-width:0.264583" id="tspan2520-3">Slope</tspan></text><text id="text2522-2-0" y="76.651871" x="124.77419" style="font-size:5.64444px;line-height:0.95;font-family:sans-serif;stroke-width:0.264583" xml:space="preserve"><tspan y="76.651871" x="124.77419" style="font-size:5.64444px;stroke-width:0.264583" id="tspan2520-3-0">Slope</tspan></text><text id="text2522-2-9" y="64.765778" x="116.0374" style="font-size:5.64444px;line-height:0.95;font-family:sans-serif;stroke-width:0.264583" xml:space="preserve"><tspan y="64.765778" x="116.0374" style="font-size:5.64444px;stroke-width:0.264583" id="tspan2520-3-4">Escarpment</tspan></text><g transform="translate(-2.9676286,-17.476035)" id="g3343"><ellipse ry="0.64398128" rx="0.64398146" cy="101.41478" cx="143.97528" id="path2702-0" style="fill:#0000ff;fill-opacity:1;stroke:#0000ff;stroke-width:0.212037;paint-order:fill markers stroke;stop-color:#000000"></ellipse><g transform="translate(0,-3.4622333)" id="g3333"><path id="line-49" d="m 82.420907,65.529761 c 4.742686,2.465312 7.188056,5.458565 10.403597,5.995291 2.954315,0.209112 4.729151,-0.289465 6.347954,-0.88166 2.197222,-0.947007 8.612582,9.011815 14.913492,9.265056 1.41951,5.755074 3.22962,10.143061 5.18837,14.010781 7.377,6.02934 15.97773,8.632221 24.6865,10.932591" style="fill:none;fill-opacity:1;stroke:#0000ff;stroke-width:0.365;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"></path><path id="line-4" d="m 39.043207,66.411421 c 5.990581,-2.899341 10.867009,-2.010564 15.517225,-0.352666 5.923965,1.172061 11.155975,-1.646669 16.575219,-1.234323 l 11.285257,0.705329 m 61.539912,39.322059 c 7.97,-0.91051 15.28869,-0.19277 22.74684,0.17633 3.89774,0.18776 5.99501,0.88994 8.03654,1.60804" style="fill:none;fill-opacity:1;stroke:#0000ff;stroke-width:0.865;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"></path><ellipse ry="0.64398128" rx="0.64398146" cy="65.538651" cx="82.325325" id="path2702" style="fill:#0000ff;fill-opacity:1;stroke:#0000ff;stroke-width:0.212037;paint-order:fill markers stroke;stop-color:#000000"></ellipse><ellipse ry="0.64398128" rx="0.64398146" cy="79.987328" cx="113.90449" id="path2702-6" style="fill:#0000ff;fill-opacity:1;stroke:#0000ff;stroke-width:0.212037;paint-order:fill markers stroke;stop-color:#000000"></ellipse><ellipse ry="0.64398128" rx="0.64398146" cy="93.740364" cx="119.18719" id="path2702-9" style="fill:#0000ff;fill-opacity:1;stroke:#0000ff;stroke-width:0.212037;paint-order:fill markers stroke;stop-color:#000000"></ellipse><ellipse ry="0.64398128" rx="0.64398146" cy="106.43917" cx="174.55403" id="path2702-8" style="display:inline;fill:#0000ff;fill-opacity:1;stroke:#0000ff;stroke-width:0.212037;paint-order:fill markers stroke;stop-color:#000000"></ellipse></g></g></g></svg>`
// graph TD;
//     A[Start] --> B{Is it working?};
//     B -- Yes --> C[Great!];
//     B -- No --> D[Try Again];
//     D --> B;
// \`\`\`
// `
// props.term.value = `<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>e</mi><mi>i</mi></msub><mo>=</mo><mfenced close=\"|\" open=\"|\"><mrow><msub><mi>x</mi><mrow><mi>m</mi><mi>i</mi></mrow></msub><mo>-</mo><msub><mi>x</mi><mrow><mi>t</mi><mi>i</mi></mrow></msub></mrow></mfenced></math>`

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
    return DOMPurify.sanitize(marked(term.value, { async: false, renderer, gfm: true, breaks: true })); // Parse Markdown to HTML
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
                <span v-if="isMarkdown" v-html="renderedMarkdownContent"></span>
                <span v-else-if="isHtml" :class="htmlClass" v-html="sanitizedHtml"></span>
                <span v-else :class="class">{{ term.value }}</span>
            </slot>
        </template>
        <!-- Full output -->
        <span v-else-if="props?.term?.value" class="prezui-literal">
            <span class="prezui-text">
                <slot name="text" :term="term" :text="term.value">
                    <span v-if="isMarkdown" v-html="renderedMarkdownContent"></span>
                    <span v-else-if="isHtml" :class="htmlClass" v-html="sanitizedHtml"></span>
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

.no-tailwind {
  all: revert-layer;
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
