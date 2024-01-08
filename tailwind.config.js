/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class", // or 'media' or 'class
    theme: {
        extend: {
            screens: {
                xs: "390px",
            },
            height: {
                screen: "100dvh",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            gridTemplateRows: {
                15: "repeat(15, minmax(0, 1fr))",
            },
            colors: {
                background: "var(--background)",
                "main-color-1": "var(--main-color-1)",
                "main-color-2": "var(--main-color-2)",
                "main-color-3": "var(--main-color-3)",
                "main-color-4": "var(--main-color-4)",
                "card-background": "var(--card-background)",
            },
            boxShadow: {
                "tab-line": "inset 0-1px 0 0, 0 2px 0 0",
            },
            keyframes: {
                overlayShow: {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                contentShow: {
                    from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
                    to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
                },
            },
            animation: {
                overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            },
        },
    },
    plugins: [],
}
