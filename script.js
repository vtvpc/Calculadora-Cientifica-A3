// --- THEME SWITCHER (DARK / LIGHT MODE) ---
function toggleTheme() {
  const htmlEl = document.documentElement;
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  if (htmlEl.classList.contains("dark")) {
    htmlEl.classList.remove("dark");
    SafeStorage.set("theme", "light");
    if (themeIcon) themeIcon.className = "fa-solid fa-sun";
    if (themeText) themeText.innerText = "LIGHT";
  } else {
    htmlEl.classList.add("dark");
    SafeStorage.set("theme", "dark");
    if (themeIcon) themeIcon.className = "fa-solid fa-moon";
    if (themeText) themeText.innerText = "DARK";
  }

  // Redraw graph if active to adapt grid colors
  if (!document.getElementById("module-graph").classList.contains("hidden")) {
    renderCanvasGraph();
  }
}

// Initialize theme from storage
(function initTheme() {
  const savedTheme = SafeStorage.get("theme");
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");
  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
    if (themeIcon) themeIcon.className = "fa-solid fa-sun";
    if (themeText) themeText.innerText = "LIGHT";
  } else {
    document.documentElement.classList.add("dark");
    if (themeIcon) themeIcon.className = "fa-solid fa-moon";
    if (themeText) themeText.innerText = "DARK";
  }
})();

// --- TAB NAVIGATION ---
function switchTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach((el) => {
    el.className =
      "tab-btn px-3 py-2 rounded border border-transparent text-cyber-dimText hover:border-cyber-cardBorder hover:text-cyber-text transition flex items-center gap-2";
  });
  document.getElementById(`module-${tabId}`).classList.remove("hidden");
  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  activeBtn.className =
    "tab-btn px-3 py-2 rounded border border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan shadow-tab-active transition flex items-center gap-2";

  if (tabId === "graph") {
    setTimeout(plotFunctionAndTable, 50);
  }
  if (tabId === "matrix") {
    if (!document.getElementById("matA_0_0")) buildMatricesInputs();
  }
}

// --- CALCULATOR ENGINE ---
let calcCurrentExpr = "";
let calcAns = 0,
  calcJustEvaluated = false;
const customVariables = {};

function updateCalcDisplay() {
  document.getElementById("calc-main-display").innerText =
    calcCurrentExpr || "0";
  document.getElementById("calc-error").textContent = "";
  document.getElementById("expression-input").value = calcCurrentExpr;
}

function calcInput(val) {
  if (calcJustEvaluated)
    calcCurrentExpr = ["+", "-", "*", "/", "^", "mod", "!", "%"].includes(val)
      ? `(${calcCurrentExpr})`
      : "";
  if (val === "mod") val = " mod ";
  calcJustEvaluated = false;
  calcCurrentExpr += val;
  updateCalcDisplay();
}

function calcClearEntry() {
  calcCurrentExpr = "";
  updateCalcDisplay();
}

function calcClearAll() {
  calcCurrentExpr = "";
  document.getElementById("calc-history-display").innerText = "";
  updateCalcDisplay();
}

function calcBackspace() {
  calcCurrentExpr = calcCurrentExpr.slice(0, -1);
  updateCalcDisplay();
}

function calcToggleSign() {
  if (calcCurrentExpr) {
    calcCurrentExpr = `-(${calcCurrentExpr})`;
    calcJustEvaluated = false;
    updateCalcDisplay();
  }
}

function evaluateMathExpression(expr, xVal) {
  return MathEngine.evaluate(expr, {
    Ans: calcAns,
    ...customVariables,
    ...(xVal === undefined ? {} : { x: xVal }),
  });
}

function calcEvaluate() {
  if (!calcCurrentExpr) return;
  try {
    const evalStr = calcCurrentExpr;
    const result = evaluateMathExpression(evalStr);
    document.getElementById("calc-history-display").innerText = evalStr + " =";
    calcAns = result;
    calcCurrentExpr = MathEngine.format(result);
    calcJustEvaluated = true;
    updateCalcDisplay();
    addHistory(evalStr, result);
  } catch (err) {
    document.getElementById("calc-error").textContent =
      "Não foi possível calcular: " + err.message;
  }
}

// Keyboard handlers must suppress native button activation (Enter would otherwise run twice).
window.addEventListener("keydown", (e) => {
  if (
    document.getElementById("module-calc").classList.contains("hidden") ||
    e.ctrlKey ||
    e.metaKey ||
    e.altKey
  )
    return;
  if (e.target.matches("input, textarea, select, [contenteditable]")) return;
  if (/^[0-9a-zA-Z]$/.test(e.key) || "+-*/.(),^%!".includes(e.key)) {
    e.preventDefault();
    calcInput(e.key);
  } else if (["Enter", "="].includes(e.key)) {
    e.preventDefault();
    calcEvaluate();
  } else if (e.key === "Backspace") {
    e.preventDefault();
    calcBackspace();
  } else if (e.key === "Escape") {
    e.preventDefault();
    calcClearAll();
  }
});

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("pwa-install-btn").classList.remove("hidden");
  document.getElementById("pwa-install-btn").classList.add("flex");
});

document
  .getElementById("pwa-install-btn")
  .addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        document.getElementById("pwa-install-btn").classList.add("hidden");
      }
      deferredPrompt = null;
    }
  });

// Initialize history log
renderHistory();
