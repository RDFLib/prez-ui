import { search, getItem, getList } from "./service";
import "./assets/sass/main.scss";
import { RDFStore } from "./store";

// const API_BASE_URL = "https://prez-v4-single-endpoints.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com";
const API_BASE_URL = "https://api.ogc.dev.kurrawong.ai";

function setupGetCatalogs() {
    document.querySelector<HTMLButtonElement>("#catalogsButton")!.addEventListener("click", async () => {
        const { data, profiles, count } = await getList(API_BASE_URL + "/catalogs");
        document.querySelector<HTMLPreElement>("#data")!.innerText = JSON.stringify(data, null, 2);
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = JSON.stringify(profiles, null, 2);
        document.querySelector<HTMLPreElement>("#count")!.innerText = `(${count})`;
    });
}

function setupGetCatalog() {
    document.querySelector<HTMLButtonElement>("#catalogButton")!.addEventListener("click", async () => {
        const { data, profiles } = await getItem(API_BASE_URL + "/catalogs/bblck-ctlg:bblocks", "bblck-ctlg:bblocks");
        document.querySelector<HTMLPreElement>("#data")!.innerText = JSON.stringify(data, null, 2);
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = JSON.stringify(profiles, null, 2);
    });
}

function setupGetCollections() {
    document.querySelector<HTMLButtonElement>("#collectionsButton")!.addEventListener("click", async () => {
        const { data, profiles, count } = await getList(API_BASE_URL + "/catalogs/bblck-ctlg:bblocks/collections");
        document.querySelector<HTMLPreElement>("#data")!.innerText = JSON.stringify(data, null, 2);
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = JSON.stringify(profiles, null, 2);
        document.querySelector<HTMLPreElement>("#count")!.innerText = `(${count})`;
    });
}

function setupClearButton() {
    document.querySelector<HTMLButtonElement>("#clear")!.addEventListener("click", async () => {
        document.querySelector<HTMLPreElement>("#data")!.innerText = "";
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = "";
    });
}

function setupSearch() {
    document.querySelector<HTMLButtonElement>("#searchButton")!.addEventListener("click", async () => {
        const { data, profiles } = await search(API_BASE_URL + "/search?q=block");
        document.querySelector<HTMLPreElement>("#data")!.innerText = JSON.stringify(data, null, 2);
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = JSON.stringify(profiles, null, 2);
    });
}

function setupConcepts() {
    document.querySelector<HTMLButtonElement>("#conceptsButton")!.addEventListener("click", async () => {
        const turtle = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX ex: <https://example.com/>
        PREFIX prez: <https://prez.dev/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        
        ex:VocPrezCatalog a dcat:Catalog ;
            rdfs:label "A Demo Catalog" ;
            dcterms:hasPart ex:SchemingConceptScheme ;
            ex:property "cataract" ;
        .
        
        ex:SchemingConceptScheme a skos:ConceptScheme ;
            dcterms:identifier "vocab1"^^prez:identifier ;
            skos:prefLabel "The Scheming Concept Scheme" ;
            skos:hasTopConcept ex:TopLevelConcept ;
            ex:property "schemish conceptual property"
        .
        
        ex:TopLevelConcept a skos:Concept ;
            skos:prefLabel "The toppiest of concepts" ;
            ex:property "a property of the toppiest concept" ;
            skos:narrower ex:SecondLevelConcept ;
            skos:inScheme ex:SchemingConceptScheme ;
        .
        
        ex:SecondLevelConcept a skos:Concept ;
            skos:prefLabel "A second level concept" ;
            ex:property "a property of the second level concept" ;
            skos:narrower ex:ThirdLevelConcept ;
            skos:inScheme ex:SchemingConceptScheme ;
        .

        ex:SecondLevelConceptBroader a skos:Concept ;
            skos:prefLabel "A second level concept broader" ;
            ex:property "a property of the first level concept" ;
            skos:broader ex:TopLevelConcept ;
            skos:inScheme ex:SchemingConceptScheme ;
        .
        
        ex:ThirdLevelConcept a skos:Concept ;
            skos:prefLabel "A third level concept" ;
            ex:property "a property of the third level concept" ;
            skos:inScheme ex:SchemingConceptScheme ;
        .`;
        const store = new RDFStore();
        store.load(turtle);
        const data = store.getItem("vocab1");
        document.querySelector<HTMLPreElement>("#data")!.innerText = JSON.stringify(data, null, 2);
    });
    
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h1>Prez Lib</h1>
    <div>
        <button id="catalogsButton">Get catalogs</button>
        <button id="catalogButton">Get catalog</button>
        <button id="collectionsButton">Get collections</button>
        <button id="searchButton">Search</button>
        <button id="conceptsButton">Concepts</button>
        <button id="clear">Clear</button>
    </div>
    <div id="content">
        <div class="column data-col">
            <h3>Data <span id="count"></span></h3>
            <pre id="data"></pre>
        </div>
        <div class="column profiles-col">
            <h3>Profiles</h3>
            <pre id="profiles"></pre>
        </div>
    </div>
    
`;

setupGetCatalogs();
setupGetCatalog();
setupGetCollections();
setupClearButton();
setupSearch();
setupConcepts();
