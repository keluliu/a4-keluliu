/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",  // Ensures Tailwind processes classes in the main HTML file
        "./frontend/src/**/*.{js,jsx,ts,tsx}", // Includes all React components and pages
        "./frontend/public/css/**/*.css" // Ensures CSS files using @apply are included
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};