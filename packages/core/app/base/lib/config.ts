// config.ts
interface Config {
    autoMarkdownDetection: boolean;
    autoHtmlDetection: boolean;
}

const config: Config = {
    autoMarkdownDetection: false,
    autoHtmlDetection: false
};

export function setConfig(options: Partial<Config>) {
    Object.assign(config, options);
}

export function getConfig(): Config {
    return config;
}
