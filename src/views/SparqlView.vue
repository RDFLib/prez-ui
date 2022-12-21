<script lang="ts" setup>
import { nextTick, onMounted, ref, inject, computed, watch, toRaw } from "vue";
import Yasqe from "@triply/yasqe";
import Yasr from "@triply/yasr";
import { useUiStore } from "@/stores/ui";
import sparqlExamples from "@/util/sparqlExamples";

const graphFormats = [
    {
        "label": "Turtle",
        "value": "text/turtle"
    },
    {
        "label": "N-Triples",
        "value": "application/n-triples"},
    {
        "label": "RDF/XML",
        "value": "application/rdf+xml"},
    {
        "label": "TriG",
        "value": "application/trig"},
    {
        "label": "N-Quads",
        "value": "application/n-quads"},
    {
        "label": "CSV",
        "value": "text/csv"},
    {
        "label": "TSV",
        "value": "text/tab-separated-values"
    },
];

const selectFormats = [
    {
        "label": "JSON",
        "value": "application/sparql-results+json"},
    {
        "label": "XML",
        "value": "application/sparql-results+xml"},
    {
        "label": "CSV",
        "value": "text/csv"},
    {
        "label": "TSV",
        "value": "text/tab-separated-values"
    },
];

const ui = useUiStore();
const apiBaseUrl = inject("config").apiBaseUrl;

const yasqe = ref(null);
const yasr = ref(null);
const selectedEndpoint = ref("all");
const queryType = ref(null);
const graphFormat = ref("text/turtle");
const selectFormat = ref("application/sparql-results+json");
const queryOptionsElement = ref(null);

const sparqlEndpoint = computed(() => {
    if (selectedEndpoint.value === "catprez") {
        return apiBaseUrl + "/c/sparql";
    } else if (selectedEndpoint.value === "spaceprez") {
        return apiBaseUrl + "/s/sparql";
    } else if (selectedEndpoint.value === "vocprez") {
        return apiBaseUrl + "/v/sparql";
    } else {
        return "https://dbpedia.org/sparql"; // temporary until API /sparql endpoints are fixed (also no top-level /sparql endpoint seems to exist)
        // return apiBaseUrl + "/sparql";
    }
});

watch(sparqlEndpoint, (newValue) => {
    if (yasqe.value) {
        yasqe.value.options.requestConfig.endpoint =  newValue;
    }
    localStorage.setItem("prez_sparql_options", JSON.stringify({
        "selectedEndpoint": selectedEndpoint.value,
        "graphFormat": graphFormat.value,
        "selectFormat": selectFormat.value,
    }));
});

watch(graphFormat, (newValue) => {
    if (yasqe.value) {
        yasqe.value.options.requestConfig.acceptHeaderGraph =  newValue;
    }
    localStorage.setItem("prez_sparql_options", JSON.stringify({
        "selectedEndpoint": selectedEndpoint.value,
        "graphFormat": graphFormat.value,
        "selectFormat": selectFormat.value,
    }));
});

watch(selectFormat, (newValue) => {
    if (yasqe.value) {
        yasqe.value.options.requestConfig.acceptHeaderSelect =  newValue;
    }
    localStorage.setItem("prez_sparql_options", JSON.stringify({
        "selectedEndpoint": selectedEndpoint.value,
        "graphFormat": graphFormat.value,
        "selectFormat": selectFormat.value,
    }));
});

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "SPARQL | Prez";
    ui.pageHeading = { name: "Prez", url: "/" };
    ui.breadcrumbs = [{ name: "SPARQL", url: "/sparql" }];

    // persist options in localStorage
    const sparqlOptions = localStorage.getItem("prez_sparql_options");
    if (sparqlOptions) {
        const sparqlOptionsParsed = JSON.parse(sparqlOptions);
        selectedEndpoint.value = sparqlOptionsParsed.selectedEndpoint;
        graphFormat.value = sparqlOptionsParsed.graphFormat;
        selectFormat.value = sparqlOptionsParsed.selectFormat;
    } else {
        localStorage.setItem("prez_sparql_options", JSON.stringify({
            "selectedEndpoint": selectedEndpoint.value,
            "graphFormat": graphFormat.value,
            "selectFormat": selectFormat.value,
        }));
    }

    // yasqe & yasr config
    nextTick(() => {
        yasqe.value = new Yasqe(document.getElementById("yasqe"), {
            showQueryButton: true,
            resizeable: false,
            requestConfig: {
                endpoint: sparqlEndpoint.value,
                method: "GET",
                adjustQueryBeforeRequest: (y) => { // add comment in query for Accept header to address caching issue
                    return `# ${(queryType.value === "SELECT" || queryType.value === "ASK") ? selectFormat.value : graphFormat.value}\n${y.getValue()}`;
                }
            },
        });
        yasr.value = new Yasr(document.getElementById("yasr"));

        // initialise options
        yasqe.value.options.requestConfig.acceptHeaderGraph = graphFormat.value;
        yasqe.value.options.requestConfig.acceptHeaderSelect = selectFormat.value;
        queryType.value = yasqe.value.getQueryType();
        yasr.value.config.prefixes = yasqe.value.getPrefixesFromQuery();

        // events
        yasqe.value.on("change", (y) => {
            queryType.value = y.getQueryType();
        });
        yasqe.value.on("query", (y, request) => {
            yasr.value.config.prefixes = y.getPrefixesFromQuery();
        });
        yasqe.value.on("queryResponse", (y, response, duration) => {
            yasr.value.setResponse(response, duration);
        });
    });
});

function loadExample(query: string) {
    toRaw(yasqe.value).setValue(query); // fixes errors when loading example then clicking in editor - proxy issues with setValue() in Vue
    yasqe.value.saveQuery();
}

function copy(text: string) {
    navigator.clipboard.writeText(text.trim());
}
</script>

<template>
    <h1>SPARQL Endpoint</h1>
    <p>Here you can perform more advanced querying using <a href="https://www.w3.org/TR/sparql11-query/" target="_blank" rel="noopener noreferrer">SPARQL</a> (SPARQL Protocol and RDF Query Language). This page acts both as an interactive querying page as well as an endpoint for clients.</p>
    <div id="query-options" ref="queryOptionsElement">
        <div class="query-option">
            <div class="query-option-title">Endpoint</div>
            <select name="endpoint" id="endpoint" @change="selectedEndpoint = $event.target.value">
                <option value="all" :selected="selectedEndpoint === 'all'">All</option>
                <option value="catprez" :selected="selectedEndpoint === 'catprez'">CatPrez</option>
                <option value="spaceprez" :selected="selectedEndpoint === 'spaceprez'">SpacePrez</option>
                <option value="vocprez" :selected="selectedEndpoint === 'vocprez'">VocPrez</option>
            </select>
        </div>
        <div v-if="queryType === 'SELECT' || queryType === 'ASK'" class="query-option">
            <div class="query-option-title">Results Format</div>
            <select name="select-format" id="select-format" @change="selectFormat = $event.target.value">
                <option v-for="option in selectFormats" :value="option.value" :selected="selectFormat === option.value">{{ option.label }}</option>
            </select>
        </div>
        <div v-else-if="queryType === 'CONSTRUCT' || queryType === 'DESCRIBE'" class="query-option">
            <div class="query-option-title">Results Format</div>
            <select name="graph-format" id="graph-format" @change="graphFormat = $event.target.value">
                <option v-for="option in graphFormats" :value="option.value" :selected="graphFormat === option.value">{{ option.label }}</option>
            </select>
        </div>
        <div class="query-option">
            <div class="query-option-title">Examples</div>
            <div class="example-buttons">
                <button v-for="example in sparqlExamples" class="btn sm outline" @click="loadExample(example.query)">{{ example.shortTitle }}</button>
            </div>
        </div>
    </div>
    <div id="yasqe"></div>
    <div id="yasr"></div>
    <h2>Example Queries</h2>
    <div v-for="example in sparqlExamples">
        <h3>{{ example.title }}</h3>
        <p>{{ example.description }}</p>
        <pre>
            <code>{{ example.query.trim() }}</code>
            <div class="code-btns">
                <button
                    class="code-btn"
                    title="Load into SPARQL editor"
                    @click="queryOptionsElement.scrollIntoView({ behavior: 'smooth' }); loadExample(example.query)"
                >
                    Load
                </button>
                <button
                    class="code-btn"
                    title="Copy"
                    @click="copy(example.query)"
                >
                    <i class="fa-regular fa-copy"></i>
                </button>
            </div>
        </pre>
    </div>
    
</template>

<style lang="scss" scoped>
#query-options {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    margin-bottom: 16px;

    .query-option {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .query-option-title {
            font-size: 0.9em;
        }

        select {
            padding: 4px 6px;
        }

        .example-buttons {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
        }
    }
}

pre {
    background-color: #e5e5e5;
    padding: 12px;
    border-radius: $borderRadius;
    position: relative;
    white-space: normal;

    code {
        white-space: pre;
    }

    .code-btns {
        display: flex;
        flex-direction: row;
        gap: 8px;
        position: absolute;
        top: 0;
        right: 0;
        padding: inherit;
        visibility: hidden;
        opacity: 0;
        @include transition(opacity);

        button.code-btn {
            padding: 4px 6px;
            cursor: pointer;
            background-color: transparent;
            border: 1px solid #bcbcbc;
            border-radius: $borderRadius;
            @include transition(background-color);

            &:hover {
                background-color: #d5d5d5;
            }
        }
    }

    &:hover .code-btns {
        visibility: visible;
        opacity: 1;
    }
}
</style>