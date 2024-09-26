import globalProfiles from "../plugins/globalProfiles";

// composables/useGlobalProfiles.ts
const PROPERTY_SHACL = 'http://www.w3.org/ns/shacl#property';
const PROPERTY_SHACL_PATH = 'http://www.w3.org/ns/shacl#path';
const UNION_ID = 'http://www.w3.org/ns/shacl#union';

type PathElement = { "@id"?: string; "@list"?: PathElement[] };

async function processPath(path: PathElement[]): Promise<string[]> {
  return await Promise.all(
    path
      .flatMap(async (e) => 
        e["@id"] 
          ? e["@id"] 
          : e["@list"]?.[0]?.["@id"] === UNION_ID
            ? (await processPath(e["@list"]?.[1]?.["@list"] || [])).filter(Boolean)
            : (await processPath(e["@list"] || [])).flat()
      )
  ).then((results) => results.filter((item): item is string => Boolean(item)));
}

export const useGlobalProfiles = () => {
  const profiles = useState<Record<string, string[]> | null>('globalProfiles', () => null);

  if (!profiles.value) {
    const { public: { prezApiEndpoint } } = useRuntimeConfig();

    setTimeout(async () => {
      try {
        const data: any[] = await $fetch(`${prezApiEndpoint}/profiles?page=1&limit=999&_mediatype=application/ld%2Bjson`);

        const newProfiles = await data.reduce(async (accPromise, profile) => {
          const acc = await accPromise;
          if (PROPERTY_SHACL in profile) {
            for (const props of profile[PROPERTY_SHACL]) {
              const lookup = data.find((p: any) => p['@id'] === props['@id']);
              if (lookup && PROPERTY_SHACL_PATH in lookup) {
                acc[profile['@id']] = await processPath(lookup[PROPERTY_SHACL_PATH]);
              }
            }
          }
          return acc;
        }, Promise.resolve({} as Record<string, string[]>));

        profiles.value = newProfiles;
        if (import.meta.dev) console.log('globalProfiles (dev mode)', newProfiles);

      } catch (err) {
        console.error('Failed to fetch global profiles', err);
      }
    }, 0);
  }

  return { globalProfiles: profiles };
};
