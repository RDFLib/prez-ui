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