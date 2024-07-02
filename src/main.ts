import { createApp, Transition, TransitionGroup } from "vue";
import pinia from "@/stores/pinia";
import App from "@/App.vue";
import router from "@/router";
import config from "@/config";
import { sidenavConfigKey, enabledPrezsConfigKey, apiBaseUrlConfigKey, mapConfigKey, perPageConfigKey, conceptPerPageConfigKey, enableScoresKey } from "@/types";
import { Tooltip } from "floating-vue";
import VueDOMPurifyHTML from 'vue-dompurify-html';
import VueGoogleMaps from "@fawmi/vue-google-maps";

import "floating-vue/dist/style.css";
import "@bosquig/vue3-treeselect/dist/vue3-treeselect.css";
import "@/assets/sass/main.scss";

const app = createApp(App);

app.provide(sidenavConfigKey, config.sidenav === "true");
app.provide(enabledPrezsConfigKey, config.enabledPrezs.split(","));
app.provide(perPageConfigKey, config.perPage);
app.provide(conceptPerPageConfigKey, config.conceptPerPage);
app.provide(enableScoresKey, config.enableScores === "true");
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
app.use(VueDOMPurifyHTML);
app.component("Tooltip", Tooltip);
// disable warnings for TreeSelect
app.component("transition", Transition);
app.component("transition-group", TransitionGroup);

app.mount("#app");
