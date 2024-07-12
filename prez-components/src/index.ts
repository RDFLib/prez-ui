import { App } from "vue";
import "./assets/sass/main.scss";

import * as components from './components';

// import PrezUIItemList from "./components/PrezUIItemList.vue";

export * from "./types";

// export {
//     PrezUIItemList,
// };

import { setTheme } from './settingsManager';

const PrezComponents = {
  install(app: App) {
    Object.keys(components).forEach(key => {
      app.component(key, components[key as keyof typeof components]);
    });
  },
  setTheme
};

export default PrezComponents;
