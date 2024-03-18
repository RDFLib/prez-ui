import type { PrezItem } from "./types";
import { RDFStore } from "./store";

class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

export async function apiGet(url: string) {
    const r = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "text/anot+turtle"
        }
    });

    if (!r.ok) {
        throw new NetworkError(`Network error - status code ${r.status}: ${r.statusText}`);
    }

    // left out parsing profile link headers for now

    const data = await r.text(); // always get turtle string
    return { data };
}

export async function getList(url: string, baseClass: string): Promise<PrezItem[]> {
    const { data } = await apiGet(url);
    const store = new RDFStore();
    store.load(data);
    return store.getList(baseClass);
}

export async function getItem(url: string, baseClass: string): Promise<PrezItem> {
    const { data } = await apiGet(url);
    const store = new RDFStore();
    store.load(data);
    return store.getItem(baseClass);
}
