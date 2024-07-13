import { App, DefineComponent } from "vue";
import "./assets/sass/main.scss";

//import * as components from './components';


// import PrezUIItemList from "./components/PrezUIItemList.vue";

export * from "./types";

// export {
//     PrezUIItemList,
// };

import { setTheme } from './settingsManager';

// const PrezComponents = {
//   install(app: App) {
//     Object.keys(components).forEach(key => {
//       app.component(key, components[key as keyof typeof components]);
//     });
//   },
//   setTheme
// };

const components = import.meta.glob('./components/*.vue');

const PrezComponents = {
    install(app: App) {
        Object.keys(components).forEach(async (key) => {
            const mod = await components[key]() as { default: DefineComponent }; // Explicitly type `mod`
            const componentName = key
                .replace('./components/', '')
                .replace('.vue', '')
                .replace(/\/([a-z])/g, (_, letter) => letter.toUpperCase());

            app.component(componentName, mod.default);
        });
    },
    setTheme
};

export default PrezComponents;