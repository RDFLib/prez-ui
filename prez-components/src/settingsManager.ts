export const themes:Record <string, string> = {
    default: 'Default Theme',
    primevue: 'PrimeVue Theme',
    // Add more themes as needed
};

export const styles:Record <string, Record <string, string>> = {
    default: {
        style1: 'Red'
    },
    primevue: {
        style1: 'Default'
    }
}

export const setStyle = (style: string) => {
    localStorage.setItem('style', style);
};
  
export const getStyle = () => {
    return localStorage.getItem('style') || '';
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