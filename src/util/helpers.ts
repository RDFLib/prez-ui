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