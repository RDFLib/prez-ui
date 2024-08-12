import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import { usePassThrough } from 'primevue/passthrough';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.500}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        }
    }
});

const CustomPreset = usePassThrough(
    MyPreset,
    {
        // global: {
        //     css: `
        //         .p-button {
        //             padding: 12rem;
        //         }`
        // },        
        panel: {
            title: {
                class: ['leading-none font-light text-4xl']
            }
        }
    },
    {
        mergeSections: true,
        mergeProps: false
    }
);

export default {
    preset: MyPreset,
    options: {
        darkModeSelector: '.p-dark'
    }
};