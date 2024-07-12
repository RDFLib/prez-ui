export const themes = {
    default: 'Default Theme',
    primevue: 'PrimeVue Theme',
    // Add more themes as needed
};
  
export const setTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
};
  
export const getTheme = () => {
    return localStorage.getItem('theme') || 'default';
};

export const setDebug = (debug: boolean) => {
    localStorage.setItem('debug', debug.toString());
};
  
export const getDebug = () => {
    return localStorage.getItem('debug') === 'true';
};