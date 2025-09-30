import daisyui from "daisyui";

const config = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0B0D10",
        surface: "#121315",
        surfaceMuted: "#191A1C",
        interactive: "#2A2F36",
        accent: "#17B358"
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(23, 179, 88, 0.35)",
        inset: "inset 0 0 0 1px #2A2F36"
      }
    }
  },
  daisyui: {
    themes: [
      {
        daynight: {
          primary: "#17B358",
          "primary-content": "#03190C",
          secondary: "#2A2F36",
          "secondary-content": "#F4F8F6",
          accent: "#17B358",
          neutral: "#191A1C",
          "base-100": "#0B0D10",
          "base-200": "#121315",
          "base-300": "#191A1C",
          info: "#4A90E2",
          success: "#17B358",
          warning: "#F5A623",
          error: "#E35C5C"
        }
      }
    ],
    darkTheme: "daynight"
  },
  plugins: [daisyui]
};

export default config;
