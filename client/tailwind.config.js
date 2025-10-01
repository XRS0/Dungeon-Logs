import daisyui from "daisyui";

const withOpacity = (variable) => ({ opacityValue }) => {
  if (opacityValue === undefined) {
    return `rgb(var(${variable}) / 1)`;
  }
  return `rgb(var(${variable}) / ${opacityValue})`;
};

const config = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: withOpacity("--color-canvas"),
        surface: withOpacity("--color-surface"),
        surfaceMuted: withOpacity("--color-surface-muted"),
        interactive: withOpacity("--color-interactive"),
        accent: withOpacity("--color-accent"),
        textPrimary: withOpacity("--color-text-primary"),
        textSecondary: withOpacity("--color-text-secondary")
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
        daylight: {
          primary: "#146D3C",
          "primary-content": "#F6FFF9",
          secondary: "#E7F3EE",
          "secondary-content": "#0B0D10",
          accent: "#17B358",
          neutral: "#F3F5F7",
          "neutral-content": "#121315",
          "base-100": "#F5F7F9",
          "base-200": "#E8EEF3",
          "base-300": "#D7E0E8",
          info: "#1D7DD8",
          success: "#17B358",
          warning: "#E8A21B",
          error: "#C64747"
        }
      },
      {
        daynight: {
          primary: "#17B358",
          "primary-content": "#03190C",
          secondary: "#2A2F36",
          "secondary-content": "#F4F8F6",
          accent: "#17B358",
          neutral: "#191A1C",
          "neutral-content": "#F6FFF9",
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
    lightTheme: "daylight",
    darkTheme: "daynight"
  },
  plugins: [daisyui]
};

export default config;
