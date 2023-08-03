import { createApp } from "vue";
import pinia from "@/stores/pinia";
import App from "@/App.vue";
import router from "@/router";
import config from "@/config";
import { sidenavConfigKey, enabledPrezsConfigKey, apiBaseUrlConfigKey, mapConfigKey, perPageConfigKey, conceptPerPageConfigKey } from "@/types";

import VueGoogleMaps from '@fawmi/vue-google-maps'

import "@/assets/sass/main.scss";

const app = createApp(App);

app.provide(sidenavConfigKey, config.sidenav === "true");
app.provide(enabledPrezsConfigKey, config.enabledPrezs.split(","));
app.provide(perPageConfigKey, config.perPage);
app.provide(conceptPerPageConfigKey, config.conceptPerPage);
app.provide(apiBaseUrlConfigKey, config.apiBaseUrl.replace(/\/$/, ""));
app.provide(mapConfigKey, config.map);

app.use(pinia);
app.use(router);
app.use(VueGoogleMaps, {
    load: {
        key: config.map.settings.apiKey,
        libraries: "drawing"
    },
})

app.mount("#app");
