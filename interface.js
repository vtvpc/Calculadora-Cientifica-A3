function readNumber(id) {
  const el = document.getElementById(id),
    raw = el?.value;
  if (!raw?.trim() || !Number.isFinite(Number(raw)))
    throw Error(
      "Informe um número finito em " + (el?.getAttribute("aria-label") || id),
    );
  return Number(raw);
}
let memoryValue = 0;
function memoryAction(action) {
  try {
    if (action === "clear") memoryValue = 0;
    else if (action === "recall") {
      calcInput("(" + MathEngine.format(memoryValue) + ")");
      return;
    } else {
      const value = evaluateMathExpression(calcCurrentExpr || "0");
      memoryValue = MathEngine.math[action === "add" ? "add" : "subtract"](
        memoryValue,
        value,
      );
    }
    document.getElementById("memory-status").textContent =
      "M = " + MathEngine.format(memoryValue);
  } catch (err) {
    document.getElementById("memory-status").textContent = err.message;
  }
}
async function copyResult() {
  try {
    await navigator.clipboard.writeText(calcCurrentExpr || "0");
    document.getElementById("memory-status").textContent = "Copiado";
  } catch {
    document.getElementById("memory-status").textContent =
      "Selecione a expressão para copiar (clipboard indisponível)";
  }
}
const expressionInput = document.getElementById("expression-input");
expressionInput.addEventListener("input", () => {
  calcCurrentExpr = expressionInput.value;
  calcJustEvaluated = false;
  document.getElementById("calc-main-display").textContent =
    calcCurrentExpr || "0";
  document.getElementById("calc-error").textContent = "";
});
expressionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    calcEvaluate();
  } else if (e.key === "Escape") calcClearAll();
});
document.getElementById("angle-mode").addEventListener("change", (e) => {
  MathEngine.setAngle(e.target.value);
  if (!document.getElementById("module-graph").classList.contains("hidden"))
    plotFunctionAndTable();
});
const catalog = [
  ["Básica", "Raiz de índice n", "nthRoot(32, 5)"],
  ["Básica", "Valor absoluto", "abs(-3.5)"],
  ["Básica", "Fatorial duplo", "doubleFactorial(7)"],
  ["Básica", "Logaritmo base arbitrária", "log(8,2)"],
  ["Básica", "Arredondamento", "round(3.14159,3)"],
  ["Básica", "MDC / MMC", "lcm(12,18)"],
  ["Básica", "Primalidade", "isPrime(97)"],
  ["Básica", "Fatores primos", "factorize(360)"],
  ["Básica", "Fração exata", "fraction(0.125)"],
  ["Básica", "Dízima 0.1(6)", 'periodic(0,"1","6")'],
  ["Básica", "Grandes números", 'bignumber("12345678901234567890")+1'],
  ["Básica", "Somatório / produtório", "sum([1,2,3,4,5])"],
  ["Básica", "Fibonacci exato", "fibonacci(100)"],
  ["Básica", "Progressão aritmética (termo)", "arithmetic(2,3,10)"],
  ["Básica", "Progressão geométrica (termo)", "geometric(2,3,5)"],
  ["Trigonometria", "Secante / cossecante / cotangente", "sec(0)"],
  ["Trigonometria", "Inversas", "asin(0.5)"],
  ["Trigonometria", "Hiperbólicas e inversas", "asinh(sinh(2))"],
  ["Trigonometria", "Graus → radianos", 'to(unit(180,"deg"),"rad")'],
  ["Trigonometria", "Grados → graus", 'to(unit(100,"grad"),"deg")'],
  ["Complexos", "Operações", "(2+3i)*(1-i)"],
  ["Complexos", "Conjugado", "conj(2+3i)"],
  ["Complexos", "Módulo e argumento (RAD)", "arg(1+i)"],
  ["Complexos", "Parte real / imaginária", "im(2+3i)"],
  ["Complexos", "Euler / polar → retangular", "2*exp(i*pi/3)"],
  ["Complexos", "Raiz complexa principal", "sqrt(-4)"],
  ["Álgebra linear", "Determinante", "det([[1,2],[3,4]])"],
  ["Álgebra linear", "Inversa", "inv([[1,2],[3,4]])"],
  ["Álgebra linear", "Sistema linear", "lusolve([[2,0],[0,3]],[[4],[9]])"],
  ["Álgebra linear", "Identidade", "identity(3)"],
  ["Álgebra linear", "Posto / escalonamento", "rref([[1,2],[2,4]])"],
  ["Álgebra linear", "Produto escalar", "dot([1,2,3],[4,5,6])"],
  ["Álgebra linear", "Produto vetorial", "cross([1,0,0],[0,1,0])"],
  ["Álgebra linear", "Norma", "norm([3,4])"],
  [
    "Álgebra linear",
    "Autovalores / autovetores numéricos",
    "eigs([[2,0],[0,3]])",
  ],
  ["Probabilidade", "Normal (densidade)", "normal(0,0,1)"],
  ["Probabilidade", "Binomial (massa)", "binomial(10,3,0.5)"],
  ["Probabilidade", "Poisson (massa)", "poisson(2,3)"],
  ["Probabilidade", "Combinação com repetição", "combinationsWithRep(5,3)"],
  ["Probabilidade", "Probabilidade condicional P(A∩B)/P(B)", "0.2/0.5"],
  [
    "Financeira",
    "Montante simples (taxa decimal)",
    "simpleInterest(1000,0.02,12)",
  ],
  ["Financeira", "Montante composto", "compoundInterest(1000,0.01,12)"],
  ["Financeira", "Valor presente", "presentValue(1100,0.1,1)"],
  ["Financeira", "Prestação Price", "payment(1000,0.01,12)"],
  ["Financeira", "Prestação SAC (parcela k)", "sac(1200,0.01,12,1)"],
  ["Financeira", "Taxa equivalente (n períodos)", "equivalentRate(0.12,12)"],
  ["Financeira", "Desconto / porcentagem acumulada", "1000*(1-10%)*(1-5%)"],
  ["Programação", "AND / OR / XOR (32 bits)", "bitXor(5,3)"],
  ["Programação", "NOT (32 bits com sinal)", "bitNot(0)"],
  ["Programação", "Deslocamento (0 a 31)", "leftShift(1,8)"],
  ["Programação", "Resto (mod matemático, sinal do divisor)", "-10 mod 3"],
  ["Unidades e física", "Comprimento", 'to(unit(1,"km"),"m")'],
  ["Unidades e física", "Massa", 'to(unit(1,"kg"),"g")'],
  ["Unidades e física", "Área", 'to(unit(1,"m^2"),"cm^2")'],
  ["Unidades e física", "Volume", 'to(unit(1,"L"),"cm^3")'],
  ["Unidades e física", "Temperatura", 'to(unit(0,"degC"),"degF")'],
  ["Unidades e física", "Velocidade", 'to(unit(72,"km/h"),"m/s")'],
  ["Unidades e física", "Aceleração", 'to(unit(1,"m/s^2"),"cm/s^2")'],
  ["Unidades e física", "Tempo", 'to(unit(2,"hour"),"s")'],
  ["Unidades e física", "Energia", 'to(unit(1,"kWh"),"J")'],
  ["Unidades e física", "Potência", 'to(unit(1,"kW"),"W")'],
  ["Unidades e física", "Pressão", 'to(unit(1,"atm"),"Pa")'],
  ["Unidades e física", "Frequência", 'to(unit(1,"MHz"),"Hz")'],
  [
    "Unidades e física",
    "Constantes SI: c, g0, hPlanck, kB, NA",
    "hPlanck*1e14",
  ],
];
function panel(title, html, parent) {
  const el = document.createElement("details");
  el.className =
    "bg-cyber-card border border-cyber-cardBorder rounded-xl p-4 font-mono text-xs mt-4";
  const summary = document.createElement("summary");
  summary.className = "text-cyber-cyan cursor-pointer font-bold";
  summary.textContent = title;
  el.append(summary);
  const content = document.createElement("div");
  content.className = "mt-3 space-y-3";
  content.innerHTML = html;
  el.append(content);
  parent.append(el);
  return el;
}
const main = document.querySelector("#module-calc > div");
panel(
  "FUNÇÕES AVANÇADAS // BUSCA E EXEMPLOS",
  `<input id="function-search" aria-label="Buscar função" class="tool-input" placeholder="Buscar categoria ou função"><div id="function-catalog" class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto"></div><p>Os exemplos inserem uma expressão: pressione = para calcular. Ângulos em RAD por padrão; DEG afeta funções trigonométricas diretas e inversas. Hiperbólicas e arg usam radianos. x deve ser definido abaixo.</p><p>% divide o operando anterior por 100: 200*10% = 20; 200+10% = 200.1. Resto usa mod. Complexos usam i. Matrizes: [[1,2],[3,4]]. Decimais com ponto. Resultados comuns são aproximações IEEE 754; frações e BigNumber são explícitos.</p><label>Variáveis (JSON, números finitos) <input id="variables-input" class="tool-input" value='{"x":2}'></label><button id="variables-save" class="btn-cyber-op p-2 rounded">DEFINIR VARIÁVEIS</button><p id="variables-status" role="status"></p>`,
  main,
);
function renderCatalog() {
  const query = document.getElementById("function-search").value.toLowerCase();
  const list = document.getElementById("function-catalog");
  list.replaceChildren();
  for (const [category, name, expr] of catalog.filter((row) =>
    row.join(" ").toLowerCase().includes(query),
  )) {
    const b = document.createElement("button");
    b.className = "btn-cyber-op p-2 rounded text-left";
    b.textContent = category + " // " + name;
    b.title = expr;
    b.addEventListener("click", () => {
      calcCurrentExpr = expr;
      calcJustEvaluated = false;
      updateCalcDisplay();
      expressionInput.focus();
    });
    list.append(b);
  }
}
renderCatalog();
document
  .getElementById("function-search")
  .addEventListener("input", renderCatalog);
document.getElementById("variables-save").addEventListener("click", () => {
  try {
    const raw = document.getElementById("variables-input").value;
    if (raw.length > 1000) throw Error("Definição longa demais");
    const vars = JSON.parse(raw);
    if (
      !vars ||
      Array.isArray(vars) ||
      typeof vars !== "object" ||
      Object.keys(vars).length > 20 ||
      Object.values(vars).some(
        (x) => typeof x !== "number" || !Number.isFinite(x),
      )
    )
      throw Error("Use um objeto JSON com até 20 variáveis numéricas");
    MathEngine.evaluate("0", vars);
    Object.keys(customVariables).forEach((k) => delete customVariables[k]);
    Object.assign(customVariables, vars);
    document.getElementById("variables-status").textContent =
      "Variáveis definidas";
  } catch (err) {
    document.getElementById("variables-status").textContent = err.message;
  }
});
panel(
  "ÁLGEBRA // EQUAÇÕES E TRIÂNGULOS",
  `<p>ax²+bx+c=0 (a=0 resolve equação linear). Raízes complexas são exibidas explicitamente.</p><div class="grid grid-cols-3 gap-2"><input id="quad-a" aria-label="a" class="tool-input" type="number" value="1"><input id="quad-b" aria-label="b" class="tool-input" type="number" value="-3"><input id="quad-c" aria-label="c" class="tool-input" type="number" value="2"></div><button id="quadratic-solve" class="btn-cyber-op p-2 rounded">RESOLVER EQUAÇÃO</button><p id="quadratic-result" role="status"></p><p>Lei dos cossenos e área: lados a, b e ângulo C entre eles em graus.</p><div class="grid grid-cols-3 gap-2"><input id="tri-a" aria-label="Lado a" class="tool-input" type="number" value="3"><input id="tri-b" aria-label="Lado b" class="tool-input" type="number" value="4"><input id="tri-c" aria-label="Ângulo C" class="tool-input" type="number" value="90"></div><button id="triangle-solve" class="btn-cyber-op p-2 rounded">CALCULAR TRIÂNGULO</button><p id="triangle-result" role="status"></p>`,
  main,
);
function action(button, result, fn) {
  document.getElementById(button).addEventListener("click", () => {
    try {
      document.getElementById(result).textContent = fn();
    } catch (err) {
      document.getElementById(result).textContent = err.message;
    }
  });
}
action("quadratic-solve", "quadratic-result", () =>
  Advanced.quadratic(
    readNumber("quad-a"),
    readNumber("quad-b"),
    readNumber("quad-c"),
  )
    .map(MathEngine.format)
    .join("; "),
);
action("triangle-solve", "triangle-result", () =>
  JSON.stringify(
    Advanced.triangle(
      readNumber("tri-a"),
      readNumber("tri-b"),
      readNumber("tri-c"),
    ),
  ),
);
panel(
  "ESTATÍSTICA // DADOS E REGRESSÃO",
  `<label>Dados X (vírgula ou espaço; decimal com ponto)<textarea id="stats-x" class="tool-input">1,2,3,4,5</textarea></label><label>Dados Y para regressão (opcional)<textarea id="stats-y" class="tool-input"></textarea></label><label>Pesos para média ponderada (opcional)<textarea id="stats-weights" class="tool-input"></textarea></label><button id="statistics-run" class="btn-cyber-op p-2 rounded">ANALISAR DADOS</button><pre id="statistics-result" role="status" class="whitespace-pre-wrap break-all"></pre><p>Quartis usam interpolação linear entre posições (n−1)p. Variância amostral usa n−1.</p>`,
  main,
);
action("statistics-run", "statistics-result", () => {
  const parse = (id) =>
    document.getElementById(id).value.trim()
      ? Advanced.dataset(document.getElementById(id).value)
      : [];
  return JSON.stringify(
    Advanced.statistics(
      parse("stats-x"),
      parse("stats-y"),
      parse("stats-weights"),
    ),
    null,
    2,
  );
});
panel(
  "PROGRAMAÇÃO // CONVERSÃO DE BASES",
  `<input id="base-number" aria-label="Número inteiro para converter" class="tool-input" value="255"><label>Origem <select id="base-from" class="tool-input"><option>10</option><option>2</option><option>8</option><option>16</option></select></label><label>Destino <select id="base-to" class="tool-input"><option>16</option><option>2</option><option>8</option><option>10</option></select></label><button id="base-convert" class="btn-cyber-op p-2 rounded">CONVERTER BASE</button><p id="base-result" role="status"></p><p>Conversões inteiras exatas (BigInt), até 256 dígitos. Operações bitwise do catálogo usam inteiros de 32 bits com sinal, complemento de dois.</p>`,
  main,
);
action("base-convert", "base-result", () =>
  Advanced.convertBase(
    document.getElementById("base-number").value.trim(),
    Number(document.getElementById("base-from").value),
    Number(document.getElementById("base-to").value),
  ),
);
renderHistory();
panel(
  "FUNÇÕES PERSONALIZADAS // f(x)",
  `<p>Defina até 5 funções por sessão. Nomes são únicos e não podem ser redefinidos; recursão e atribuições na expressão não são permitidas.</p><label>Nome <input id="custom-name" class="tool-input" value="f"></label><label>Expressão em x <input id="custom-expression" class="tool-input" value="x^2+1"></label><button id="custom-define" class="btn-cyber-op p-2 rounded">DEFINIR FUNÇÃO</button><p id="custom-status" role="status"></p>`,
  main,
);
action("custom-define", "custom-status", () => {
  const name = document.getElementById("custom-name").value.trim();
  MathEngine.defineFunction(
    name,
    document.getElementById("custom-expression").value,
  );
  return `Função definida. Exemplo: ${name}(2)`;
});
let favorites = SafeStorage.json("calc_favorites", []);
if (!Array.isArray(favorites)) favorites = [];
favorites = favorites
  .filter((x) => typeof x === "string" && x.length <= 1000)
  .slice(0, 20);
panel(
  "FAVORITOS // EXPRESSÕES SALVAS",
  `<button id="favorite-save" class="btn-cyber-op p-2 rounded">SALVAR EXPRESSÃO ATUAL</button><button id="favorite-clear" class="btn-cyber-op p-2 rounded">LIMPAR FAVORITOS</button><div id="favorite-list" class="flex flex-wrap gap-2"></div>`,
  main,
);
function renderFavorites() {
  const list = document.getElementById("favorite-list");
  list.replaceChildren();
  for (const expr of favorites) {
    const b = document.createElement("button");
    b.className = "btn-cyber-op p-2 rounded break-all";
    b.textContent = expr;
    b.addEventListener("click", () => reuseExpr(expr));
    list.append(b);
  }
}
document.getElementById("favorite-save").addEventListener("click", () => {
  if (calcCurrentExpr && calcCurrentExpr.length <= 1000) {
    favorites = [...new Set([calcCurrentExpr, ...favorites])].slice(0, 20);
    SafeStorage.set("calc_favorites", JSON.stringify(favorites));
    renderFavorites();
  }
});
document.getElementById("favorite-clear").addEventListener("click", () => {
  favorites = [];
  SafeStorage.remove("calc_favorites");
  renderFavorites();
});
renderFavorites();
