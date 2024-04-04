import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import StyleClass from "primevue/styleclass";
import Ripple from "primevue/ripple";
import router from "./router";
import App from "./App.vue";
// import "primevue/resources/themes/lara-dark-indigo/theme.css";
import "primevue/resources/themes/aura-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "./assets/sass/main.scss";


const app = createApp(App);

app.directive("tooltip", Tooltip);
app.directive("styleclass", StyleClass);
app.directive("ripple", Ripple);

app.use(router);
app.use(PrimeVue, {
    ripple: true
});

app.mount("#app");
