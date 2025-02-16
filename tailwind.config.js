/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",               // ✅ Ensure Tailwind scans the root HTML
        "./frontend/src/**/*.{js,jsx,ts,tsx}", // ✅ Scan all frontend React files
        "./frontend/src/components/**/*.{js,jsx}", // ✅ Scan all components
        "./frontend/src/pages/**/*.{js,jsx}", // ✅ Scan all pages
        "./frontend/src/css/**/*.css" // ✅ Ensure Tailwind watches CSS files
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3B82F6", // Custom primary color (blue)
                secondary: "#6B7280", // Custom secondary color (gray)
                danger: "#EF4444" // Custom danger color (red)
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"], // Default sans-serif font
            },
        },
    },
    plugins: [],
};