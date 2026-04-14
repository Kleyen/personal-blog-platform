import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      typography: {
        gray: {
          css: {
            "--tw-prose-body": "#374151",
            "--tw-prose-headings": "#111827",
            "--tw-prose-links": "#4f46e5",
          },
        },
      },
    },
  },
  plugins: [
    // Uncomment after: npm i -D @tailwindcss/typography
    // require("@tailwindcss/typography"),
  ],
} satisfies Config;
