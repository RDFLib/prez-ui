/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SIDENAV: string; // true | false
    readonly VITE_ENABLED_PREZS: string; // CatPrez | SpacePrez | VocPrez comma separated
    readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}