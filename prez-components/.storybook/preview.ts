import { type Preview, setup } from "@storybook/vue3";
import { addons } from '@storybook/manager-api';
import { watch, reactive, onUnmounted } from 'vue';

import docsPage from './docsPage';

import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';
import "primeicons/primeicons.css";
import Tooltip from 'primevue/tooltip';

import { withTheme } from './withTheme.ts';
import { getStyle, getTheme } from "../src/settingsManager.ts";

const style = getStyle();
if(style) {

    const theme = getTheme();
    const importPath = `../src/themes/${theme}/styles/${style}.css`;

//    console.log("******CSS ", importPath)

    import (`../src/themes/${theme}/styles/${style}.css`);
    // const stylesMap = import.meta.glob("../src/themes/*/styles/*.css", { query: '' });
    // const importStyle = stylesMap[importPath];
    // console.log('ImportPath = ', importPath);
    // console.log("StyleMap", stylesMap);
    // console.log('ImportPath resolves to ', importStyle);
    // if (importStyle) {
    //   console.log('Importing ', importPath);
    //   importStyle().then(() => {
    //     console.log('Style imported successfully');
    //   }).catch(err => {
    //     console.error('Error importing style:', err);
    //   });
    // }
}

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
        docs: {
//            page: docsPage,
            toc: true
        },
        options: {
            showPanel: false, // Optionally hide the story panel
            storySort: {
                order: [
                    'Introduction',
                    ['Overview', 'Installation'],
                    'Standard Components',
                    'Data Components',
                    ['PrezUILiteral', 'PrezUINode', 'PrezUIHeader'],
                    'Containers', 
                    'Pages',
                    '*',
                    'Config',
                    'Testing'
                ],
            },
        },
    }
};

export default preview;
