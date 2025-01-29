import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        agriSky: "#C3EBFA",
        agriSkyLight: "#EDF9FD",
        agriPurple: "#CFCEFF",
        agriPurpleLight: "#F1F0FF",
        agriYellow: "#FAE27C",
        agriLightYellow: "#FEFCEB",
      },
    },
  },
  plugins: [],
} satisfies Config;
