import { type Preview, setup } from "@storybook/vue3";
import { addons } from '@storybook/manager-api';
import { watch, reactive, onUnmounted } from 'vue';

import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';
import "primeicons/primeicons.css";
import Tooltip from 'primevue/tooltip';

import { withTheme } from './withTheme.ts';

import './theme.css';

setup((app) => {
    app.directive('tooltip', Tooltip);
    app.use(PrimeVue, {
        // Default theme configuration
        theme: {
            preset: Aura,
            options: {
                prefix: 'p',
                darkModeSelector: 'light',
                cssLayer: false
            }
        }
     });    
});

const preview: Preview = {
    parameters: {
    options: {
        storySort: {
        order: [
            'Introduction',
            'Base', 
            'Composite', 
            'Containers', 
            'Pages'
        ],
        },
    },
    }
};

export default preview;
