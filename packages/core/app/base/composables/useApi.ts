export function useApi() {

    // default fallback values
    let apiEndpoint = import.meta?.env?.NUXT_PUBLIC_PREZ_API_ENDPOINT || 'http://prez-components-layer/define-your-api-endpoint-in-.env-file';
    let currentPath = '/';

    /**
     * Try to get the runtime config and route from the Nuxt context
     * If it fails, fallback to the default values
     * 
     * This is a workaround when running in storybook, until a better solution is found
     */
    try {
      const route = useRoute();
      const config = useRuntimeConfig();
      apiEndpoint = config.public.prezApiEndpoint || apiEndpoint;
      currentPath = route.fullPath;
    } catch (ex) {
      console.log('useApi: failed to get runtime config and route, using fallback values', ex);
    }
  
    const getRelativeApiUrl = () => {
      return `${apiEndpoint}${currentPath}`;
    }

    const getBaseApiUrl = () => {
      return apiEndpoint;
    }
  
    return {
      getRelativeApiUrl, getBaseApiUrl
    }
  }