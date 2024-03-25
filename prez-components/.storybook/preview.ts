import { type Preview, setup } from "@storybook/vue3";
import PrimeVue from "primevue/config";
//import "primevue/resources/themes/lara-dark-indigo/theme.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import Tooltip from 'primevue/tooltip';

setup((app) => {
    app.directive('tooltip', Tooltip);
    app.use(PrimeVue);
});

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
