import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // base light mode colors
        background: "#ffffff",
        card: "#f9fafb",
        "blue-accent": "#20c997",
        "green-accent": "#2dd4bf",
        "whatsapp": "#25D366",
        "muted": "#6b7280",
        "muted-light": "#d1d5db",
        "border": "rgba(0,0,0,0.08)",
      },
      backgroundColor: {
        card: {
          DEFAULT: "#f9fafb",
          dark: "#1a3a47",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
