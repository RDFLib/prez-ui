/**
 * Converts a path pattern with placeholders like {name} into a RegExp.
 * Handles escaping special regex characters in the pattern.
 * @param pattern The path pattern string (e.g., /objects/{id}).
 * @returns A RegExp object for matching paths.
 */
function convertPathToRegex(pattern: string): RegExp {
    // 1. Escape all potential regex special characters in the pattern
    // Need to escape characters that have special meaning in regex
    const escapedPattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // 2. Replace escaped placeholders like \{name\} with a capturing group ([^/]+)
    //    ([^/]+) matches one or more characters that are NOT a slash, capturing the value.
    //    We use \\\{ and \\\} because the braces were escaped in the previous step.
    const regexString = escapedPattern.replace(/\\\{([^}]+)\\\}/g, '([^/]+)');

    // 3. Add anchors ^ and $ to ensure the regex matches the entire path string
    const finalRegexString = `^${regexString}$`;

    try {
        return new RegExp(finalRegexString);
    } catch (e) {
        // Log error if regex creation fails (e.g., invalid pattern)
        console.error(`Failed to create RegExp for pattern: ${pattern}`);
        console.error(`Generated regex string: ${finalRegexString}`);
        console.error(e);
        // Return a regex that never matches as a fallback
        return new RegExp('(?!)');
    }
}

/**
 * Checks if a given path matches any of the provided patterns using RegExp.
 * Patterns can include path parameters like {param}.
 * @param path The current path string.
 * @param patterns An array of pattern strings (e.g., ["/objects/{id}", "/datasets"]).
 * @returns True if the path matches any pattern, false otherwise.
 */
export function matchesAnyPattern(path: string, patterns: string[]): boolean {
    if (!patterns || patterns.length === 0) {
        return false;
    }
    // Normalize path: remove trailing slash unless it's the root path "/"
    const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

    // Use Array.some() to check if any pattern matches the normalized path
    return patterns.some(pattern => {
        // Normalize pattern: remove trailing slash unless it's the root pattern "/"
        const normalizedPattern = pattern.length > 1 && pattern.endsWith('/') ? pattern.slice(0, -1) : pattern;
        const regex = convertPathToRegex(normalizedPattern);
        // Test the normalized path against the generated regex
        return regex.test(normalizedPath);
    });
}
