// composables/useGlobalConfig.ts

// Simplified helper function to convert path patterns to RegExp
export function convertPathToRegex(pattern: string): RegExp {
    // 1. Escape all potential regex special characters in the pattern
    const escapedPattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // 2. Replace escaped placeholders like \{name\} with ([^/]+)
    //    ([^/]+) matches one or more characters that are NOT a slash
    const regexString = escapedPattern.replace(/\\\{([^}]+)\\\}/g, '([^/]+)');

    // 3. Add anchors to match the entire path
    const finalRegexString = `^${regexString}$`;

    try {
        return new RegExp(finalRegexString);
    } catch (e) {
        console.error(`Failed to create RegExp for pattern: ${pattern}`);
        console.error(`Generated regex string: ${finalRegexString}`);
        console.error(e);
        return new RegExp('(?!)'); // Regex that never matches
    }
}

// Simplified helper function using Array.some()
export function matchesAnyPattern(path: string, patterns: string[]): boolean {
    // Check if 'some' pattern in the array matches the path
    return patterns.some(pattern => {
        const regex = convertPathToRegex(pattern);
        return regex.test(path);
    });
}

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
                    .filter((item:any)=>item['@type'].includes('https://prez.dev/ont/ObjectEndpoint'))
                    .flatMap((item:any)=>item['https://prez.dev/ont/apiPath'].map((i:any)=>i['@value']));

                const listingEndpoints = paths
                    .filter((item:any)=>item['@type'].includes('https://prez.dev/ont/ListingEndpoint'))
                    .flatMap((item:any)=>item['https://prez.dev/ont/apiPath'].map((i:any)=>i['@value']));

                if (runtimeConfig.public.prezDebug) {
                    console.log('objectEndpoints (debug mode)', objectEndpoints);
                    console.log('listingEndpoints (debug mode)', listingEndpoints);
                }

                const hasSparql = data.find((item: any) => item?.['https://prez.dev/sparqlEndpointEnabled']);
                // update the sparql option if the endpoint supports it
                updateAppConfig({ menu: appConfig.menu.map(item => item.url === '/sparql' ? { ...item, active: !!hasSparql } : item) });

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
