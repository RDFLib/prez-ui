import { ref, watch } from "vue";
import { defineStore } from "pinia";
import type { Profile, Breadcrumb, ProfileHeader } from "@/types";

export const useUiStore = defineStore("ui", () => {
    // state
    const rightNavConfig = ref<{
        enabled: boolean;
        profiles?: ProfileHeader[];
        currentUrl?: string;
    }>({
        enabled: true,
        profiles: [],
        currentUrl: ""
    });
    const pageTitle = ref("Prez");
    const pageHeading = ref({
        name: "Prez",
        url: "/"
    });
    const breadcrumbs = ref<Breadcrumb[]>([]);
    const profiles = ref<{[token: string]: Profile}>({});
    const apiVersion = ref("");

    // getters

    // actions

    // get profiles from local storage
    if (localStorage.getItem("profiles")) {
        profiles.value = JSON.parse(localStorage.getItem("profiles") || "");
    }

    // watch & save profiles to local storage
    watch(profiles, (state) => {
        localStorage.setItem("profiles", JSON.stringify(state));
    }, { deep: true });

    return {
        // state
        rightNavConfig,
        pageTitle,
        pageHeading,
        breadcrumbs,
        profiles,
        apiVersion,

        // getters

        // actions
    }
});

