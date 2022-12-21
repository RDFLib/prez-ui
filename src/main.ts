import { createApp } from "vue";
import pinia from "@/stores/pinia";
import App from "@/App.vue";
import router from "@/router";
import config from "@/config.json";

import "@/assets/sass/main.scss";

const app = createApp(App);

app.provide("config", config);

app.use(pinia);
app.use(router);

app.mount("#app");
