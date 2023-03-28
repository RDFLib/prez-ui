/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SIDENAV: string; // true | false
    readonly VITE_ENABLED_PREZS: string; // CatPrez | SpacePrez | VocPrez comma separated
    readonly VITE_API_BASE_URL: string;
    readonly VITE_MAP_SETTINGS_API_KEY: string;
    readonly VITE_MAP_SETTINGS_OPTIONS_CENTER_LAT: number;
    readonly VITE_MAP_SETTINGS_OPTIONS_CENTER_LNG: number;
    readonly VITE_MAP_SETTINGS_OPTIONS_STREETVIEW_CONTROLLER: boolean;
    readonly VITE_MAP_SETTINGS_OPTIONS_ZOOM: number;
    readonly VITE_MAP_SEARCH_SPATIAL_DATASET_CLASS: string;
    readonly VITE_MAP_SEARCH_SPATIAL_MEMBERSHIP_RELATIONSHIP: string;
    readonly VITE_MAP_SEARCH_PROPS_F_ID: string;
    readonly VITE_MAP_SEARCH_PROPS_F_LABEL: string;
    readonly VITE_MAP_SEARCH_PROPS_FC_LABEL: string;
    readonly VITE_MAP_SEARCH_PROPS_DS_LABEL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
