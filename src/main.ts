import { createApp } from "vue";
import pinia from "@/stores/pinia";
import App from "@/App.vue";
import router from "@/router";
import config from "@/config.json";
import { configKey } from "@/types";

import "@/assets/sass/main.scss";

const app = createApp(App);

app.provide(configKey, config);

app.use(pinia);
app.use(router);

app.mount("#app");
