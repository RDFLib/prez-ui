import { getProfiles, type PrezProfiles } from "prez-lib-test";

export const useGlobalProfiles = () => {
    const profiles = useState<PrezProfiles | null>('globalProfiles', () => null);
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
