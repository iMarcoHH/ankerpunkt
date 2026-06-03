import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0D1B2A",
        red: "#C8392B",
        steel: "#3D5166",
        sand: "#E8DFD0",
        cement: "#9AA0A6",
        signal: "#E8A832",
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        plex: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
