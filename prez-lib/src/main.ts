// import { setupCounter } from "./store";
import { getCatalogs, getCatalog } from "./service";

const API_BASE_URL = "https://d1sx2k22urhvtf.cloudfront.net";

function setupGetCatalogs() {
    document.querySelector<HTMLButtonElement>("#catalogsButton")!.addEventListener("click", async () => {
        const data = await getCatalogs(API_BASE_URL);
        document.querySelector<HTMLPreElement>("#catalogsData")!.innerText = JSON.stringify(data, null, 2);
    });
}

function setupGetCatalog() {
    document.querySelector<HTMLButtonElement>("#catalogButton")!.addEventListener("click", async () => {
        const data = await getCatalog(API_BASE_URL, "pd:democat");
        document.querySelector<HTMLPreElement>("#catalogData")!.innerText = JSON.stringify(data, null, 2);
    });
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Prez Utils</h1>
    <button id="catalogsButton">Get catalogs</button>
    <pre id="catalogsData"></pre>
    <button id="catalogButton">Get catalog</button>
    <pre id="catalogData"></pre>
  </div>
`;

setupGetCatalogs();
setupGetCatalog();