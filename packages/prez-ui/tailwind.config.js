/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    safelist: ["dark"],
    prefix: "",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                tertiary: {
                    DEFAULT: "hsl(var(--tertiary))",
                    foreground: "hsl(var(--tertiary-foreground))",
                },
                link: {
                    DEFAULT: "hsl(var(--link))",
                    foreground: "hsl(var(--link-foreground))",
                },
            },
        },
    },
}