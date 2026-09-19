/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "tw-",
  corePlugins: {
    // Bootstrap and the legacy Hotux styles own global element styling.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
