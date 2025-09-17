export default defineAppConfig({
    menu: [
        { "label": "Home", "url": "/", "active": true },
        // currently, the /catalogs root listing endpoint menu option can be overridden by the global config from PrezAPI, 
        // this occurs when PrezAPI is configured to use different listings endpoints
        // if you overwrite the appConfig to not include /catalogs, the global config will leave your custom listings endpoint menu option in place
        { "label": "Catalogs", "url": "/catalogs", "active": true },  
        { "label": "Search", "url": "/search", "active": true },
        { "label": "SPARQL", "url": "/sparql", "active": false },
        { "label": "Profiles", "url": "/profiles", "active": true },
        { "label": "About", "url": "/about", "active": true },
        { "label": "API Documentation", "url": "/docs", "active": true }
    ],

    nameSubstitutions: {
        'catalogs': 'Catalogs',
        'items': 'Items',
        'profiles': 'Profiles',
        'collections': 'Collections',
        'object': 'Object'
    } as Record<string, string>,

    breadcrumbPrepend: [
        { label: 'Home', url: '/' }
    ],

    utilsMenu: [
        { label: 'home', url: '/' },
        { label: 'ui', url: '/_prez/ui' },
        { label: 'lib', url: '/_prez/lib' },
        { label: 'cfg', url: '/_prez/cfg' },
        { label: 'tailwind', url: '/_tailwind/' }
    ],

    pagination: {
        itemsPerPage: 10,
        conceptsPerPage: 20
    }

});

declare module '@nuxt/schema' {
    interface AppConfigInput {
        menu?: Array<{ label: string, url: string, active?: boolean }>,
        nameSubstitutions?: Record<string, string>,
        breadcrumbPrepend?: Array<{ label: string, url: string }>,
        utilsMenu?: Array<{ label: string, url: string }>
    }
}
