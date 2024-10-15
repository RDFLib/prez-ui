import { useGetPrezAPIEndpoint } from "@/site/composables/useLib";

// composables/useGlobalConfig.ts
export const useGlobalConfig = () => {
    const globalConfig = useState<{config: any, version: string} | null>('globalConfig', () => null);
    const route = useRoute();
    const runtimeConfig = useRuntimeConfig();
    
    if(runtimeConfig.public.prezAllowApiEndpointChange && route.query?.['_api'] && route.query['_api'] !== localStorage.getItem('prezApi')) {
        localStorage.setItem('prezApi', route.query['_api'].toString());
    }

    if (!globalConfig.value) {
      const apiEndpoint = useGetPrezAPIEndpoint();
  
      setTimeout(async () => {
        try {
          const data:any = await $fetch(apiEndpoint + '?_mediatype=application/ld%2Bjson');
          if(runtimeConfig.public.prezDebug) {
            console.log('globalConfig (debug mode)', data);
          }
          globalConfig.value = {config: data, version: data.find((item:any)=>item?.['https://prez.dev/version'])?.['https://prez.dev/version']?.[0]?.['@value']};
        } catch (err) {
          console.error('Failed to fetch global config', err);
        }
      }, 0);
    }
  
    return globalConfig;
};
  