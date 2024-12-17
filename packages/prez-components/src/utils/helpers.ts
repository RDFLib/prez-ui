export function isMarkdownDetected(content: string): boolean {
    const markdownPatterns = [
        /^#{1,6}\s+/m,                  // Headings (#, ##, ###, etc.)
        /\*\*[^*]+\*\*/s,               // Bold (**text**)
        /_[^_]+_/s,                     // Italic (_text_)
        /\*[^*]+\*/s,                   // Italic (*text*)
        /\[[^\]]+\]\([^)]+\)/s,         // Links [text](url)
        /^[-*+]\s+/m,                   // Unordered lists (-, *, +)
        /^\d+\.\s+/m,                   // Ordered lists (1., 2., etc.)
        /`[^`]+`/s,                     // Inline code (`code`)
        /^```[^]*?^```/ms,              // Code blocks (```...```)
        /!\[.*?\]\(.*?\)/s              // Images ![alt text](URL)
    ];
    return markdownPatterns.some((pattern) => pattern.test(content));
}

export function isHtmlDetected(content: string): boolean {
    if (typeof DOMParser !== "undefined") {
        // DOMParser approach (for browser environments)
        const doc = new DOMParser().parseFromString(content, 'text/html');
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1); // Checks for element nodes
    } else {
        // Fallback regex approach (for non-browser environments)
        const htmlRegex = /<\/?[a-z][\s\S]*>/i;
        return htmlRegex.test(content);
    }
}
