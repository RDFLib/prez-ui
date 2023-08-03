export default {
    sidenav: import.meta.env.VITE_SIDENAV,
    enabledPrezs: import.meta.env.VITE_ENABLED_PREZS,
    perPage: import.meta.env.VITE_PER_PAGE,
    conceptPerPage: import.meta.env.VITE_CONCEPT_PER_PAGE,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    map: {
        settings: {
            apiKey: import.meta.env.VITE_MAP_SETTINGS_API_KEY,
            options: {
                center: {
                    lat: import.meta.env.VITE_MAP_SETTINGS_OPTIONS_CENTER_LAT,
                    lng: import.meta.env.VITE_MAP_SETTINGS_OPTIONS_CENTER_LNG,
                },
                streetViewController: import.meta.env.VITE_MAP_SETTINGS_OPTIONS_STREETVIEW_CONTROLLER,
                zoom: import.meta.env.VITE_MAP_SETTINGS_OPTIONS_ZOOM
            }
        },
        search: {
            spatial: {
                datasetClass: import.meta.env.VITE_MAP_SEARCH_SPATIAL_DATASET_CLASS,
                membershipRelationship: import.meta.env.VITE_MAP_SEARCH_SPATIAL_MEMBERSHIP_RELATIONSHIP
            },
            props: {
                fId: import.meta.env.VITE_MAP_SEARCH_PROPS_F_ID,
                fLabel: import.meta.env.VITE_MAP_SEARCH_PROPS_F_LABEL,
                fcLabel: import.meta.env.VITE_MAP_SEARCH_PROPS_FC_LABEL,
                dsLabel: import.meta.env.VITE_MAP_SEARCH_PROPS_DS_LABEL
            }
        }
    }
};

