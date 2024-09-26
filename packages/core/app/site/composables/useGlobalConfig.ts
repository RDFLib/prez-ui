// composables/useGlobalConfig.ts
export const useGlobalConfig = () => {
    const config = useState<any>('globalConfig', () => null);
  
    if (!config.value) {
      const runtimeConfig = useRuntimeConfig();
  
      setTimeout(async () => {
        try {
          const data = await $fetch(runtimeConfig.public.prezApiEndpoint + '?_mediatype=application/ld%2Bjson');
          if (import.meta.dev) {
            console.log('globalConfig (dev mode)', data);
          }
          config.value = data;
        } catch (err) {
          console.error('Failed to fetch global config', err);
        }
      }, 0);
    }
  
    return { config };
  };
  