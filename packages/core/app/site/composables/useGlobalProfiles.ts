import { buildProfiles, dumpNodeArray, getList, getProfiles, SYSTEM_PREDICATES, type PrezBlankNode, type PrezFocusNode, type PrezNode, type PrezProfiles, type PrezProperties, type PrezProperty } from "@/base/lib";

export const useGlobalProfiles = () => {
  const profiles = ref<PrezProfiles | null>(null);
  const runtimeConfig = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  
  if (!profiles.value) {

    setTimeout(() => {
      nuxtApp.runWithContext(async () => {
        try {

          profiles.value = await getProfiles(useGetPrezAPIEndpoint());

          if (runtimeConfig.public.prezDebug) {
            console.log("Profile Meta (debug mode)", profiles.value)
          }

        } catch (err) {
          console.error('Failed to fetch global profiles', err);
        }
      });
    }, 0);
  }

  return { globalProfiles: profiles };
};
