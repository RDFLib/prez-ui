import { createApp } from "vue";
import PrimeVue from "primevue/config";
import router from "./router";
import App from "./App.vue";
import "primevue/resources/themes/lara-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import "./assets/sass/main.scss";

import Tooltip from "primevue/tooltip";

const app = createApp(App);
app.directive("tooltip", Tooltip);
app.use(router);
app.use(PrimeVue);
app.mount("#app");
