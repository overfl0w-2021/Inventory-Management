/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // Scans all files in the 'app' folder
    './pages/**/*.{js,ts,jsx,tsx}', // Scans all files in the 'pages' folder
    './components/**/*.{js,ts,jsx,tsx}', // Scans files in 'components' (if you have this folder)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

