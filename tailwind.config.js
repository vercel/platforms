const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
  ],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
  ],
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 0.8s both",
      },
      borderRadius: {
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
        "tremor-small": "0.375rem",
      },
      boxShadow: {
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",

        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",

        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",

        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",

        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      colors: {
        // dark mode
        "dark-tremor": {
          background: {
            // gray-800
            DEFAULT: "#111827",

            // gray-900
            emphasis: "#d1d5db",

            muted: "#131A2B",
            // custom
            subtle: "#1f2937", // gray-300
          },
          border: {
            DEFAULT: "#1f2937", // gray-800
          },
          brand: {
            // blue-800
            DEFAULT: "#3b82f6",

            // blue-500
            emphasis: "#60a5fa",

            faint: "#0B1229",

            // blue-400
            inverted: "#030712",

            // custom
            muted: "#172554",
            // blue-950
            subtle: "#1e40af", // gray-950
          },
          content: {
            // gray-600
            DEFAULT: "#6b7280",
            // gray-600
            emphasis: "#e5e7eb",
            // gray-50
            inverted: "#000000",

            // gray-200
            strong: "#f9fafb",

            subtle: "#4b5563", // black
          },
          ring: {
            DEFAULT: "#1f2937", // gray-800
          },
        },

        // light mode
        tremor: {
          background: {
            // gray-100
            DEFAULT: "#ffffff",

            // white
            emphasis: "#374151",

            muted: "#f9fafb",
            // gray-50
            subtle: "#f3f4f6", // gray-700
          },
          border: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          brand: {
            // blue-400
            DEFAULT: "#3b82f6",

            // blue-500
            emphasis: "#1d4ed8",

            faint: "#eff6ff",

            // blue-700
            inverted: "#ffffff",

            // blue-50
            muted: "#bfdbfe",
            // blue-200
            subtle: "#60a5fa", // white
          },
          content: {
            // gray-400
            DEFAULT: "#6b7280",
            // gray-500
            emphasis: "#374151",
            // gray-900
            inverted: "#ffffff",

            // gray-700
            strong: "#111827",

            subtle: "#9ca3af", // white
          },
          ring: {
            DEFAULT: "#e5e7eb", // gray-200
          },
        },
      },
      fontFamily: {
        cal: ["var(--font-cal)", ...fontFamily.sans],
        default: ["var(--font-inter)", ...fontFamily.sans],
        mono: ["Consolas", ...fontFamily.mono],
        title: ["var(--font-title)", ...fontFamily.sans],
      },
      fontSize: {
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-label": ["0.75rem"],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
      },
      height: {
        150: "37.5rem",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-6px) rotate(-6deg)" },
          "30%": { transform: "translateX(9px) rotate(6deg)" },
          "45%": { transform: "translateX(-9px) rotate(-3.6deg)" },
          "60%": { transform: "translateX(3px) rotate(2.4deg)" },
          "75%": { transform: "translateX(-2px) rotate(-1.2deg)" },
        },
      },
      margin: {
        30: "7.5rem",
      },
      typography: {
        DEFAULT: {
          css: {
            "blockquote p:first-of-type::after": { content: "none" },
            "blockquote p:first-of-type::before": { content: "none" },
            h1: {
              fontFamily: "Cal Sans",
            },
            h2: {
              fontFamily: "Cal Sans",
            },
            h3: {
              fontFamily: "Cal Sans",
            },
          },
        },
      },
      width: {
        1536: "1536px",
      },
    },
  },
};
