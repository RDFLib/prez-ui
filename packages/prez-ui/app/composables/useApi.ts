export function useApi() {
  const route = useRoute();
  const config = useRuntimeConfig();

  const getApiUrl = () => {
    const prezApiEndpoint = config.public.prezApiEndpoint;
    const currentPath = route.fullPath;
    return `${prezApiEndpoint}${currentPath}`
  }

  return {
    getApiUrl
  }
}