import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

// export default {
//     preset: Aura,
//     options: {
//         darkModeSelector: '.p-dark'
//     }
// };

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            0: '#ffffff',
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617'
        }
    }
});

export default {
    preset: MyPreset,
    options: {
        darkModeSelector: '.p-dark'
    }
};

//import { usePassThrough } from 'primevue/passthrough';
//import '@/base/assets/css/base.css';

// const CustomPreset = usePassThrough(
//     MyPreset,
//     {
//         panel: {
//             title: {
//                 class: ['leading-none font-light text-4xl']
//             }
//         }
//     },
//     {
//         mergeSections: true,
//         mergeProps: false
//     }
// );

