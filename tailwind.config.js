/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./frontend/index.html",         // ✅ Ensure the root HTML file is included
        "./frontend/src/**/*.{js,jsx}",  // ✅ Include all JS and JSX files
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};