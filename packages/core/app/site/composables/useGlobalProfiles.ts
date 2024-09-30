import { buildProfiles } from "@/base/lib";

export const useGlobalProfiles = () => {
  const profiles = useState<Record<string, string[]> | null>('globalProfiles', () => null);

  if (!profiles.value) {
    const { public: { prezApiEndpoint } } = useRuntimeConfig();

    setTimeout(async () => {
      try {
        const data: any[] = await $fetch(`${prezApiEndpoint}/profiles?page=1&limit=999&_mediatype=application/ld%2Bjson`);
        profiles.value = buildProfiles(data);
        if (import.meta.dev) console.log('globalProfiles (dev mode)', profiles.value);

      } catch (err) {
        console.error('Failed to fetch global profiles', err);
      }
    }, 0);
  }

  return { globalProfiles: profiles };
};
