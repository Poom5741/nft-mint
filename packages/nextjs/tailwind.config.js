module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#4A90E2", // Slightly brighter blue for contrast
          "primary-content": "#F9FBFF",
          secondary: "#1F2937", // Dark gray for secondary elements
          "secondary-content": "#E5E7EB",
          accent: "#2563EB", // Brighter accent color for important buttons
          "accent-content": "#F9FBFF",
          neutral: "#1E293B", // Darker for main content areas
          "neutral-content": "#9CA3AF",
          "base-100": "#111827", // Deep dark background
          "base-200": "#1F2937", // Slightly lighter for layered sections
          "base-300": "#374151", // Dark gray for panels and cards
          "base-content": "#D1D5DB", // Light text for readability
          info: "#3B82F6", // Blue for informational messages
          success: "#10B981", // Green for success messages
          warning: "#FBBF24", // Yellow for warnings
          error: "#EF4444", // Red for errors
          "--rounded-btn": "8px", // Slightly less rounded for a modern look
          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
