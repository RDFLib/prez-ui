interface ImportMeta {
    glob(pattern: string, options?: { query?: string }): Record<string, () => Promise<any>>;
}
