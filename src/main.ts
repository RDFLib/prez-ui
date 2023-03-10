import { createApp } from "vue";
import pinia from "@/stores/pinia";
import App from "@/App.vue";
import router from "@/router";
import config from "@/config.json";
import { configKey} from "@/types";

import VueGoogleMaps from '@fawmi/vue-google-maps'

import "@/assets/sass/main.scss";

const app = createApp(App);

app.provide(configKey, config);
app.use(pinia);
app.use(router);
app.use(VueGoogleMaps, {
    load: {
        key: config.mapSettings.apiKey,
        libraries: "drawing"
    },
})

app.mount("#app");
