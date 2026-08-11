/**
 * Override Hugo Blox Mermaid init.
 * Tailwind v4 CSS vars are oklch(...); wrapping them as rgb(oklch(...))
 * crashes Mermaid (khroma). Use hex colors Mermaid can parse.
 */
function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function mermaidThemeVariables(dark) {
  if (dark) {
    return {
      background: "#0f172a",
      primaryColor: "#1e3a5f",
      secondaryColor: "#164e63",
      tertiaryColor: "#1e293b",
      primaryBorderColor: "#38bdf8",
      secondaryBorderColor: "#22d3ee",
      tertiaryBorderColor: "#64748b",
      primaryTextColor: "#e2e8f0",
      secondaryTextColor: "#e2e8f0",
      tertiaryTextColor: "#e2e8f0",
      lineColor: "#94a3b8",
      textColor: "#e2e8f0",
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue("font-family"),
      fontSize: "13px",
    };
  }

  return {
    background: "#fafafa",
    primaryColor: "#bfdbfe",
    secondaryColor: "#a5f3fc",
    tertiaryColor: "#f5f5f5",
    primaryBorderColor: "#60a5fa",
    secondaryBorderColor: "#22d3ee",
    tertiaryBorderColor: "#a3a3a3",
    primaryTextColor: "#0f172a",
    secondaryTextColor: "#0f172a",
    tertiaryTextColor: "#0f172a",
    lineColor: "#525252",
    textColor: "#0f172a",
    fontFamily: getComputedStyle(document.documentElement).getPropertyValue("font-family"),
    fontSize: "13px",
  };
}

window.mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  securityLevel: "loose",
  flowchart: {
    nodeSpacing: 30,
    rankSpacing: 36,
    padding: 8,
  },
  themeVariables: mermaidThemeVariables(isDarkMode()),
});
