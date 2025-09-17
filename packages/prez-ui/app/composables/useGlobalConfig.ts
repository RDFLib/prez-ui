// composables/useGlobalConfig.ts

// Define the structure of the global config state
interface GlobalConfigState {
    config: any; // Keep the original config data if needed
    version: string;
    objectEndpoints: string[];
    listingEndpoints: string[];
}

export const useGlobalConfig = () => {
    const globalConfig = useState<GlobalConfigState | null>('globalConfig', () => null);
    const route = useRoute();
    const runtimeConfig = useRuntimeConfig();
    const appConfig = useAppConfig();

    // set the global config for markdown and html detection
    setConfig({
        autoMarkdownDetection: !!runtimeConfig.public.prezAutoDetectMarkdown,
        autoHtmlDetection: !!runtimeConfig.public.prezAutoDetectHtml
    });

    if (!import.meta.server
        && typeof localStorage !== 'undefined'
        && runtimeConfig.public.prezAllowApiEndpointChange
        && route.query?.['_api']
        && route.query['_api'] !== localStorage.getItem('prezApi')) {
        localStorage.setItem('prezApi', route.query['_api'].toString());
    }

    if (!globalConfig.value) {
        const apiEndpoint = useGetPrezAPIEndpoint();

        setTimeout(async () => {
            try {
                const data: any = await $fetch(apiEndpoint + '?_mediatype=application/ld%2Bjson');
                if (runtimeConfig.public.prezDebug) {
                    console.log('globalConfig (debug mode)', data);
                }
 
                const paths = data.filter((item:any)=>item['https://prez.dev/ont/apiPath']);

                // Extract endpoints
                const objectEndpoints = paths
                    .filter((item: any) =>
                      Array.isArray(item['@type']) &&
                      item['@type'].some((t: string) => t === 'https://prez.dev/ont/ObjectEndpoint')
                    )
                    .flatMap((item: any) =>
                        item['https://prez.dev/ont/apiPath']?.map((i: any) => i['@value']) ?? []
                    );

                const listingEndpoints = paths
                    .filter((item: any) =>
                        Array.isArray(item['@type']) &&
                        item['@type'].some((t: string) => t === 'https://prez.dev/ont/ListingEndpoint')
                    )
                    .flatMap((item: any) =>
                        item['https://prez.dev/ont/apiPath']?.map((i: any) => i['@value']) ?? []
                    );
                
                if (runtimeConfig.public.prezDebug) {
                    console.log('objectEndpoints (debug mode)', objectEndpoints);
                    console.log('listingEndpoints (debug mode)', listingEndpoints);
                }

                const hasSparql = data.find((item: any) => item?.['https://prez.dev/sparqlEndpointEnabled']);
                // update the sparql option if the endpoint supports it
                updateAppConfig({ menu: appConfig.menu.map(item => item.url === '/sparql' ? { ...item, active: !!hasSparql } : item) });

                // determine the root listing endpoint
                const rootListingEndpoint = listingEndpoints.find((endpoint: string) => endpoint.split('/').length === 2);
                
                // update the root listing endpoint if it's not the default /catalogs
                if(rootListingEndpoint != '/catalogs') {
                    updateAppConfig({ menu: appConfig.menu.map(item => item.url === '/catalogs' ? { ...item, url: rootListingEndpoint } : item) });
                }

                globalConfig.value = {
                    config: data,
                    version: data.find((item: any) => item?.['https://prez.dev/version'])?.['https://prez.dev/version']?.[0]?.['@value'] || 'unknown',
                    objectEndpoints: objectEndpoints,
                    listingEndpoints: listingEndpoints
                };

            } catch (err) {
                console.error('Failed to fetch global config', err);
            }
        }, 0);
    }

    return globalConfig;
};
