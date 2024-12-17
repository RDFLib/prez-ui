<script lang="ts" setup>
import { marked, Renderer } from 'marked';
import mermaid from 'mermaid';

// Sample Markdown content with a Mermaid diagram
const markdownContent = `
# Sample Markdown with Mermaidxx

## Second heeader

Here’s an example of Markdown content with a Mermaid diagram below:

\`\`\`mermaid
graph TD;
    A[Start] --> B{Is it working?};
    B -- Yes --> C[Great!];
    B -- No --> D[Try Again];
    D --> B;
\`\`\`
`;

// Custom renderer to handle Mermaid code blocks
const renderer = new Renderer();
renderer.code = ({ text, lang }) => {
    if (lang === 'mermaid') {
        return `<div class="mermaid">${text}</div>`;
    }
    return `<pre><code>${text}</code></pre>`;
};

// Process the Markdown content using `marked`
const renderedContent = computed(() => {
    return marked(markdownContent, { renderer });
});

// Initialize Mermaid after the content renders
onMounted(async () => {
    await nextTick(); // Ensure DOM is updated before initializing Mermaid
    mermaid.initialize({ startOnLoad: false }); // Manual control over Mermaid
    mermaid.init(); // Initialize Mermaid diagrams in the rendered content
});
</script>

<template>
    <div>
        <h2>Markdown with Mermaid Test</h2>
        <!-- Render the Markdown content, allowing both text and Mermaid diagrams -->
        <div class="markdown-content" v-html="renderedContent"></div>
    </div>
</template>

<style lang="css" >
.markdown-content h1 {
    font-size: 2em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
}
.markdown-content h2 {
    font-size: 1.75em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
}
.markdown-content h3 {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
}
.markdown-content p {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    line-height: 1.6;
}
.markdown-content ul,
.markdown-content ol {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding-left: 1.5em;
}
.markdown-content li {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
}
.markdown-content pre {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 0.25rem;
    overflow-x: auto;
    font-family: monospace;
    font-size: 0.9em;
}
.markdown-content code {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.9em;
}
.markdown-content blockquote {
    margin: 0.8em 0;
    padding-left: 1em;
    border-left: 4px solid #ddd;
    color: #666;
}
</style>