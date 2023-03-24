import { createApp } from "vue";
import pinia from "@/stores/pinia";
import App from "@/App.vue";
import router from "@/router";
import config from "@/config";
import { sidenavConfigKey, enabledPrezsConfigKey, apiBaseUrlConfigKey } from "@/types";

import "@/assets/sass/main.scss";

const app = createApp(App);

app.provide(sidenavConfigKey, config.sidenav === "true");
app.provide(enabledPrezsConfigKey, config.enabledPrezs.split(","));
app.provide(apiBaseUrlConfigKey, config.apiBaseUrl.replace(/\/$/, ""));

app.use(pinia);
app.use(router);

app.mount("#app");
