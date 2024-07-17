export const themes:Record <string, string> = {
    default: 'Default Theme',
    primevue: 'PrimeVue Theme',
    // Add more themes as needed
};

export const styles:Record <string, Record <string, string>> = {
    default: {
        style1: 'Default',
        style2: 'Red'
    },
    primevue: {
        style1: 'Default'
    }
}

export const setStyle = (style: string|undefined) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem('style', style || '');
    }
};
  
export const getStyle = () => {
    if(typeof window !== 'undefined') {
        return localStorage.getItem('style') || '';
    }
};

export const setTheme = (theme: string|undefined) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem('theme', theme || '');
    }
};
  
export const getTheme = () => {
    if(typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'default';
    }
};

export const setDebug = (debug: boolean|undefined) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem('debug', (debug || false).toString());
    }
};
  
export const getDebug = () => {
    if(typeof window !== 'undefined') {
        return localStorage.getItem('debug') === 'true';
    }
};