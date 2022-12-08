import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", () => {
    // state
    const rightNavConfig = ref({
        enabled: true,
        profiles: [],
        currentUrl: ""
    });

    const pageTitle = ref("Prez");
    const pageHeading = ref({
        name: "Prez",
        url: "/"
    });
    const breadcrumbs = ref([]);
    const profiles = ref({});
    const apiVersion = ref("");

    // getters

    // actions
    function updateRightNavConfig(config) {
        rightNavConfig.value = config;
    }

    function setBreadcrumbs(breadcrumbsList) {
        breadcrumbs.value = breadcrumbsList;
    }

    if (localStorage.getItem("profiles")) {
        profiles.value = JSON.parse(localStorage.getItem("profiles"));
    }

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
        updateRightNavConfig,
        setBreadcrumbs,
    }
});

