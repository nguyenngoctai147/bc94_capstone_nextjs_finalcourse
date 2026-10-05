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
    extend: {
      colors: {
        brand: "rgb(var(--ds-brand-rgb) / <alpha-value>)",
        primary: "rgb(var(--ds-primary-rgb) / <alpha-value>)",
        ink: "var(--ds-ink)",
        muted: "var(--ds-muted)",
        surface: "var(--ds-surface)",
        canvas: "var(--ds-canvas)",
        line: "var(--ds-border)",
      },
      fontFamily: {
        body: ["var(--ds-font-body)"],
        heading: ["var(--ds-font-heading)"],
      },
      fontSize: {
        body: ["var(--ds-text-body)", { lineHeight: "var(--ds-leading-body)" }],
        label: "var(--ds-text-label)",
        caption: "var(--ds-text-caption)",
        title: ["var(--ds-text-h1)", { lineHeight: "var(--ds-leading-heading)" }],
      },
      spacing: {
        gutter: "var(--ds-page-gutter)",
        section: "var(--ds-section-space)",
        layout: "var(--ds-grid-gap)",
        card: "var(--ds-card-padding)",
      },
      maxWidth: {
        content: "var(--ds-content-width)",
        reading: "var(--ds-reading-width)",
        form: "var(--ds-form-width)",
        wide: "var(--ds-wide-width)",
      },
      borderRadius: { panel: "var(--ds-radius-md)" },
      boxShadow: { panel: "var(--ds-shadow-card)" },
    },
  },
  plugins: [],
};
