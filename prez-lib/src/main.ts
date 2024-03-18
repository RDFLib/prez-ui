import { getItem, getList } from "./service";

const API_BASE_URL = "https://prez-v4-single-endpoints.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com";

function setupGetCatalogs() {
    document.querySelector<HTMLButtonElement>("#catalogsButton")!.addEventListener("click", async () => {
        const data = await getList(API_BASE_URL + "/catalogs", "dcat:Catalog");
        document.querySelector<HTMLPreElement>("#catalogsData")!.innerText = JSON.stringify(data, null, 2);
    });
}

function setupGetCatalog() {
    document.querySelector<HTMLButtonElement>("#catalogButton")!.addEventListener("click", async () => {
        const data = await getItem(API_BASE_URL + "/catalogs/bblck-ctlg:bblocks", "dcat:Catalog");
        document.querySelector<HTMLPreElement>("#catalogData")!.innerText = JSON.stringify(data, null, 2);
    });
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Prez Lib</h1>
    <button id="catalogsButton">Get catalogs</button>
    <pre id="catalogsData"></pre>
    <button id="catalogButton">Get catalog</button>
    <pre id="catalogData"></pre>
  </div>
`;

setupGetCatalogs();
setupGetCatalog();
