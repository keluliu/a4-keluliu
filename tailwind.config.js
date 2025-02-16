/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./public/**/*.html",        // Scans all HTML files inside /public
        "./src/**/*.{js,jsx,ts,tsx}" // Scans all React components & pages
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