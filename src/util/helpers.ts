import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

/**
 * Periodically checks if the profiles object is set in Pinia before resolving a Promise.
 * 
 * Loops every 500ms, times out after 20s.
 */
export function ensureProfiles() {
    return new Promise<void>((resolve, reject) => {
        let expTimer = setTimeout(reject, 20 * 1000); // time out after 20s
               
        (function waitForProfiles() {
            if (Object.keys(ui.profiles).length > 0) {
                clearTimeout(expTimer);
                return resolve();
            };
            setTimeout(waitForProfiles, 500); // checks every 500ms
        })();
    });
};

/**
 * Copies text to the clipboard
 * 
 * @param text The text to copy to the clipboard
 */
export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text.trim());
}

export function titleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Sorts an array of objects alphabetically first, and then by IRI if some elements lack a title
 * 
 * @param a 
 * @param b 
 * @returns 
 */
export const sortByTitle = <T extends {title?: string; iri: string;}>(a: T, b: T): number => {
    if (a.title && b.title) {
        return a.title.localeCompare(b.title);
    } else if (a.title) {
        return -1;
    } else if (b.title) {
        return 1;
    } else {
        return a.iri.localeCompare(b.iri);
    }
};

/**
 * Returns an integer priority based on an RDF literal's language tag
 * 
 * Priority order is: 1. `@en`, 2. `@en-*`, 3. No language tag, 4. Other language tags.
 * 
 * @param language 
 * @returns the priority order as an integer
 */
export function getLanguagePriority(language: string): number {
    // get browser language, return 0
    if (language === "en") {
        return 1;
    } else if (/en-.+/.test(language)) { // en-us, en-gb, etc.
        return 2;
    } else if (language === "") {
        return 3;
    } else {
        return 4;
    }
}
