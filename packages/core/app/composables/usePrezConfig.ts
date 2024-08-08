export function usePrezConfig() {
  try {
    const appConfig = useAppConfig();
    return appConfig;
  } catch (ex) {
    // if we're here, then we're running in storybook, and we can't access the app config obj
    return {
      layer: 'storybook-fallback',
    }
  }
}
