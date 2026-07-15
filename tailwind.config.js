/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#020617",
          900: "#0B1120",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
          500: "#475569",
          accent: "#2563EB",
          accentLight: "#3B82F6",
          accentGlow: "#60A5FA",
          success: "#10B981",
          gold: "#D4AF37",
        },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(37, 99, 235, 0.45)",
        card: "0 8px 30px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "brand-gradient":
          "radial-gradient(circle at top left, #0F1B34 0%, #020617 60%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
