module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "var(--cyber-bg)",
          card: "var(--cyber-card)",
          cardBorder: "var(--cyber-cardBorder)",
          red: "rgb(var(--cyber-red-rgb) / <alpha-value>)",
          cyan: "rgb(var(--cyber-cyan-rgb) / <alpha-value>)",
          magenta: "rgb(var(--cyber-magenta-rgb) / <alpha-value>)",
          green: "rgb(var(--cyber-green-rgb) / <alpha-value>)",
          text: "var(--cyber-text)",
          dimText: "var(--cyber-dimText)",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "Consolas", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};
module.exports.content = ["./index.html", "./*.js"];
