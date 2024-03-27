import { getItem, getList } from "./service";
import "./assets/sass/main.scss";

const API_BASE_URL = "https://prez-v4-single-endpoints.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com";

function setupGetCatalogs() {
    document.querySelector<HTMLButtonElement>("#catalogsButton")!.addEventListener("click", async () => {
        const { data, profiles } = await getList(API_BASE_URL + "/catalogs", "dcat:Catalog");
        document.querySelector<HTMLPreElement>("#data")!.innerText = JSON.stringify(data, null, 2);
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = JSON.stringify(profiles, null, 2);
    });
}

function setupGetCatalog() {
    document.querySelector<HTMLButtonElement>("#catalogButton")!.addEventListener("click", async () => {
        const { data, profiles } = await getItem(API_BASE_URL + "/catalogs/bblck-ctlg:bblocks", "dcat:Catalog");
        document.querySelector<HTMLPreElement>("#data")!.innerText = JSON.stringify(data, null, 2);
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = JSON.stringify(profiles, null, 2);
    });
}

function setupClearButton() {
    document.querySelector<HTMLButtonElement>("#clear")!.addEventListener("click", async () => {
        document.querySelector<HTMLPreElement>("#data")!.innerText = "";
        document.querySelector<HTMLPreElement>("#profiles")!.innerText = "";
    });
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h1>Prez Lib</h1>
    <div>
        <button id="catalogsButton">Get catalogs</button>
        <button id="catalogButton">Get catalog</button>
        <button id="clear">Clear</button>
    </div>
    <div id="content">
        <div class="column data-col">
            <h3>Data</h3>
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
setupClearButton();
