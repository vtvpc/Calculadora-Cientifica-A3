// Revisão final: nomes das operações matriciais, legibilidade do tema Light,
// numeração dos eixos do gráfico, acessibilidade e entradas inválidas.
const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const { auditContrast } = require("./helpers/contrast.cjs");

const TABS = [
  "calc",
  "graph",
  "matrix",
  "combinatorics",
  "calculus",
  "history",
];
const MATRIX_LABELS = {
  add: "Soma de matrizes (A + B)",
  sub: "Subtração de matrizes (A − B)",
  scalar: "Multiplicação por escalar (k × A)",
  mul: "Multiplicação de matrizes (A × B)",
  detA: "Determinante da matriz A",
  transA: "Transposta da matriz A",
  trace: "Traço da matriz A",
  rank: "Posto da matriz A",
  rref: "Escalonamento reduzido da matriz A",
  solve: "Resolver sistema linear (Ax = B)",
  invA: "Matriz inversa de A",
};

test.beforeEach(async ({ page }) => {
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") page.errors.push(m.text());
  });
  await page.goto("/");
});
test.afterEach(async ({ page }) => {
  expect(page.errors).toEqual([]);
});

async function useTheme(page, theme) {
  await page.evaluate((t) => localStorage.setItem("theme", t), theme);
  await page.reload();
  await expect(page.locator("#theme-text")).toHaveText(theme.toUpperCase());
  await page.waitForTimeout(400); // transição de cor de 0,3 s do body
}
const op = (page, name) =>
  page.locator(`[onclick="matrixOperation('${name}')"]`);
async function fillMatrix(page, name, rows) {
  await page.locator(`#mat${name}-rows`).fill(String(rows.length));
  await page.locator(`#mat${name}-rows`).press("Tab");
  await page.locator(`#mat${name}-cols`).fill(String(rows[0].length));
  await page.locator(`#mat${name}-cols`).press("Tab");
  for (let i = 0; i < rows.length; i++)
    for (let j = 0; j < rows[0].length; j++)
      await page.locator(`#mat${name}_${i}_${j}`).fill(String(rows[i][j]));
}
const plot = async (page, expr) => {
  await page.locator("#func-expr").fill(expr);
  await page.locator('[onclick="plotFunctionAndTable()"]').click();
  await expect(page.locator("#graph-error")).toBeEmpty();
  return page.evaluate(() => graphState.view);
};

for (const [label, viewport] of [
  ["desktop", { width: 1366, height: 900 }],
  ["celular", { width: 390, height: 844 }],
]) {
  test(`Matrizes: nomes completos sem cortes nem sobreposição (${label})`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.locator("#tab-btn-matrix").click();
    const boxes = [];
    for (const [id, text] of Object.entries(MATRIX_LABELS)) {
      const button = op(page, id);
      await expect(button).toBeVisible();
      await expect(button).toHaveText(text);
      expect(
        await button.evaluate(
          (b) =>
            b.scrollWidth <= b.clientWidth && b.scrollHeight <= b.clientHeight,
        ),
      ).toBe(true);
      boxes.push(await button.boundingBox());
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const [a, b] = [boxes[i], boxes[j]];
        const overlap =
          a.x < b.x + b.width - 0.5 &&
          b.x < a.x + a.width - 0.5 &&
          a.y < b.y + b.height - 0.5 &&
          b.y < a.y + a.height - 0.5;
        expect(overlap).toBe(false);
      }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);
  });
}

test("Matrizes: todas as operações com dimensões variadas e erros", async ({
  page,
}) => {
  await page.locator("#tab-btn-matrix").click();
  const result = page.locator("#matrix-result-container");
  const cells = () => result.locator("td").allTextContents();
  await fillMatrix(page, "A", [
    [1, 2, 3],
    [4, 5, 6],
  ]);
  await fillMatrix(page, "B", [
    [7, 8],
    [9, 10],
    [11, 12],
  ]);
  await op(page, "mul").click();
  expect(await cells()).toEqual(["58", "64", "139", "154"]);
  await op(page, "transA").click();
  expect(await cells()).toEqual(["1", "4", "2", "5", "3", "6"]);
  await page.locator("#matrix-scalar").fill("0.5");
  await op(page, "scalar").click();
  expect(await cells()).toEqual(["0.5", "1", "1.5", "2", "2.5", "3"]);
  await op(page, "rank").click();
  await expect(result).toHaveText("2");
  await op(page, "rref").click();
  expect(await cells()).toEqual(["1", "0", "-1", "0", "1", "2"]);
  for (const [name, message] of [
    ["add", "incompatíveis"],
    ["sub", "incompatíveis"],
    ["detA", "quadrada"],
    ["invA", "quadrada"],
    ["solve", "Ax=B"],
  ]) {
    await op(page, name).click();
    await expect(result).toContainText(message);
  }
  await page.locator("#matrix-scalar").fill("");
  await op(page, "scalar").click();
  await expect(result).toContainText("Escalar k");
  await fillMatrix(page, "A", [
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2],
  ]);
  await fillMatrix(page, "B", [[8], [-11], [-3]]);
  await op(page, "solve").click();
  expect(await cells()).toEqual(["2", "3", "-1"]);
  await op(page, "detA").click();
  await expect(result).toHaveText("-1");
  await op(page, "trace").click();
  await expect(result).toHaveText("3");
  await op(page, "invA").click();
  expect(await cells()).toEqual([
    "4",
    "3",
    "-1",
    "-2",
    "-2",
    "1",
    "5",
    "4",
    "-1",
  ]);
  await fillMatrix(page, "A", [
    [1, 2, 3],
    [2, 4, 6],
    [1, 1, 1],
  ]);
  await op(page, "rank").click();
  await expect(result).toHaveText("2");
  await op(page, "detA").click();
  await expect(result).toHaveText("0");
  await op(page, "solve").click();
  await expect(result).toContainText("singular");
  await page.locator("#matA_0_0").fill("");
  await op(page, "detA").click();
  await expect(result).toContainText("Matriz A, linha 1, coluna 1");
});

test("Gráfico: eixos numerados com positivos, negativos e zero", async ({
  page,
}) => {
  await page.locator("#tab-btn-graph").click();
  const num = (labels) => labels.map(Number);
  for (const expr of ["x^2", "sin(x)", "2*x+1", "x^3", "1/x"]) {
    const v = await plot(page, expr);
    expect(v.xLabels).toContain("0");
    expect(num(v.xLabels).some((x) => x < 0)).toBe(true);
    expect(num(v.xLabels).some((x) => x > 0)).toBe(true);
    expect(v.yLabels.length).toBeGreaterThanOrEqual(3);
    for (const y of num(v.yLabels)) {
      expect(Number.isFinite(y)).toBe(true);
      expect(y).toBeGreaterThanOrEqual(v.ymin);
      expect(y).toBeLessThanOrEqual(v.ymax);
    }
    if (expr !== "x^2") expect(num(v.yLabels).some((y) => y < 0)).toBe(true);
  }
  // sin(x): valores decimais no eixo Y
  const sin = await plot(page, "sin(x)");
  expect(sin.yLabels.some((l) => l.includes("."))).toBe(true);
  // Resultados pequenos e grandes
  const small = await plot(page, "0.001*x");
  expect(small.yLabels.some((l) => /^-?0\.00\d/.test(l))).toBe(true);
  const big = await plot(page, "1e7*x");
  expect(big.yLabels.some((l) => /e/.test(l))).toBe(true);
  expect(new Set(big.yLabels).size).toBe(big.yLabels.length);
  // Os números realmente aparecem no canvas: pixels de texto na linha do eixo X.
  await plot(page, "x^2");
  const inked = await page.evaluate(() => {
    const c = document.getElementById("function-canvas");
    const ctx = c.getContext("2d");
    const dpr = c.width / graphState.view.width;
    const y0 =
      (graphState.view.height -
        ((0 - graphState.view.ymin) /
          (graphState.view.ymax - graphState.view.ymin)) *
          graphState.view.height +
        5) *
      dpr;
    const data = ctx.getImageData(
      0,
      Math.round(y0),
      c.width,
      Math.round(13 * dpr),
    ).data;
    // Pixels de texto: contraste forte com o fundo do tema (robusto a antialiasing).
    const bg = graphThemeColors()
      .bg.match(/[0-9a-f]{2}/gi)
      .map((h) => parseInt(h, 16));
    let count = 0;
    for (let i = 0; i < data.length; i += 4)
      if (
        Math.abs(data[i] - bg[0]) +
          Math.abs(data[i + 1] - bg[1]) +
          Math.abs(data[i + 2] - bg[2]) >
        250
      )
        count++;
    return count;
  });
  expect(inked).toBeGreaterThan(50);
});

test("Gráfico: numeração acompanha zoom, pan e reset; PNG preserva números", async ({
  page,
}) => {
  await page.locator("#tab-btn-graph").click();
  const initial = await plot(page, "x^2");
  expect(initial.xStep).toBe(2);
  const canvas = page.locator("#function-canvas");
  await canvas.hover();
  for (let i = 0; i < 25; i++) await page.mouse.wheel(0, -100);
  const zoomed = await page.evaluate(() => graphState.view);
  expect(zoomed.xStep).toBeLessThan(initial.xStep);
  expect(zoomed.xLabels.some((l) => l.includes("."))).toBe(true);
  for (let i = 0; i < 30; i++) await page.mouse.wheel(0, 100);
  const out = await page.evaluate(() => graphState.view);
  expect(out.xStep).toBeGreaterThan(initial.xStep);
  await page.getByText("RESET VIEW", { exact: true }).click();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + 50, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 50, box.y + 100, { steps: 5 });
  await page.mouse.up();
  const panned = await page.evaluate(() => graphState.view);
  expect(panned.xmin).toBeLessThan(-20);
  const inside = (v) =>
    v.xLabels.map(Number).every((x) => x >= v.xmin && x <= v.xmax);
  expect(inside(panned)).toBe(true);
  expect(panned.xLabels.map(Number).some((x) => x < -20)).toBe(true);
  // Segundo arraste: eixo Y sai da tela e os números ficam presos à borda.
  await page.mouse.move(box.x + 50, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 50, box.y + 100, { steps: 5 });
  await page.mouse.up();
  const offscreen = await page.evaluate(() => graphState.view);
  expect(offscreen.xmax).toBeLessThan(0);
  expect(inside(offscreen)).toBe(true);
  expect(offscreen.yLabels.length).toBeGreaterThan(2);
  await page.getByText("RESET VIEW", { exact: true }).click();
  const reset = await page.evaluate(() => graphState.view);
  expect(reset.xLabels).toEqual(initial.xLabels);
  expect(reset.yLabels).toEqual(initial.yLabels);
  const download = page.waitForEvent("download");
  await page.getByText("EXPORTAR PNG", { exact: true }).click();
  const file = await (await download).path();
  const png = fs.readFileSync(file);
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  const size = await canvas.evaluate((c) => [c.width, c.height]);
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(size);
  // PNG idêntico ao canvas (com números e fundo opaco do tema).
  const same = await canvas.evaluate(
    (c, b64) => c.toDataURL("image/png") === "data:image/png;base64," + b64,
    png.toString("base64"),
  );
  expect(same).toBe(true);
  const alpha = await canvas.evaluate(
    (c) => c.getContext("2d").getImageData(2, 2, 1, 1).data[3],
  );
  expect(alpha).toBe(255);
});

test("Gráfico: tela HiDPI e celular mantêm numeração nítida e legível", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator("#tab-btn-graph").click();
  await expect(page.locator("#func-table-body tr")).toHaveCount(21);
  const v = await page.evaluate(() => graphState.view);
  const [w, cw] = await page
    .locator("#function-canvas")
    .evaluate((c) => [c.width, c.getBoundingClientRect().width]);
  expect(w).toBe(Math.round(cw * 2));
  expect(v.xLabels.length).toBeGreaterThanOrEqual(3);
  expect(v.yLabels.length).toBeGreaterThanOrEqual(3);
  // Espaçamento mínimo entre rótulos do eixo X evita sobreposição.
  const px = (v.xStep / (v.xmax - v.xmin)) * v.width;
  expect(px).toBeGreaterThanOrEqual(30);
  await context.close();
});

for (const theme of ["light", "dark"]) {
  test(`Gráfico (${theme}): números, eixos e curvas contrastam com o fundo`, async ({
    page,
  }) => {
    await useTheme(page, theme);
    await page.locator("#tab-btn-graph").click();
    await expect(page.locator("#func-table-body tr")).toHaveCount(21);
    const ratios = await page.evaluate(() => {
      const hex = (h) => h.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));
      const lum = (c) =>
        hex(c)
          .map((v) =>
            (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
          )
          .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
      const ratio = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
        return (x + 0.05) / (y + 0.05);
      };
      const c = graphThemeColors();
      return {
        label: ratio(c.label, c.bg),
        axis: ratio(c.axis, c.bg),
        curves: c.curves.map((k) => ratio(k, c.bg)),
      };
    });
    expect(ratios.label).toBeGreaterThanOrEqual(4.5);
    expect(ratios.axis).toBeGreaterThanOrEqual(3);
    for (const r of ratios.curves) expect(r).toBeGreaterThanOrEqual(3);
  });
}

test("Modo Light: contraste WCAG AA em todas as abas, painéis e resultados", async ({
  page,
}) => {
  await useTheme(page, "light");
  await page.evaluate(() =>
    document.querySelectorAll("details").forEach((d) => (d.open = true)),
  );
  // Preenche resultados e mensagens de erro para auditar também esses estados.
  await page.locator("#expression-input").fill("1/0");
  await page.locator("#expression-input").press("Enter");
  await page.locator("#statistics-run").click();
  await page.locator("#quadratic-solve").click();
  const failures = [];
  for (const tab of TABS) {
    await page.locator("#tab-btn-" + tab).click();
    if (tab === "graph") await page.locator("#func-expr").fill("x^2");
    if (tab === "matrix") await op(page, "mul").click();
    if (tab === "combinatorics")
      await page.locator('[onclick="calculateCombinatorics()"]').click();
    if (tab === "calculus") {
      await page.locator('[onclick="calculateNumerical()"]').click();
      await page.locator('[onclick="solveRoot()"]').click();
    }
    await page.waitForTimeout(250);
    const r = await page.evaluate(auditContrast);
    expect(r.checked).toBeGreaterThan(10);
    failures.push(...r.failures.map((f) => `${tab}: ${f}`));
  }
  expect(failures).toEqual([]);
  // Brilhos neon desligados no Light.
  const glow = await page
    .locator("#tab-btn-history")
    .evaluate(
      () =>
        getComputedStyle(document.querySelector(".text-glow-cyan")).textShadow,
    );
  expect(glow).toBe("none");
});

test("Modo Dark: paleta neon original preservada", async ({ page }) => {
  await useTheme(page, "dark");
  const v = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const get = (n) => cs.getPropertyValue(n).trim();
    return {
      cyan: get("--cyber-cyan-rgb"),
      magenta: get("--cyber-magenta-rgb"),
      green: get("--cyber-green-rgb"),
      bg: get("--cyber-bg"),
      title: getComputedStyle(document.querySelector("h1")).color,
      glow: getComputedStyle(document.querySelector("h1")).textShadow,
    };
  });
  expect(v).toMatchObject({
    cyan: "0 243 255",
    magenta: "255 0 127",
    green: "0 255 102",
    bg: "#12161f",
    title: "rgb(0, 243, 255)",
  });
  expect(v.glow).toContain("rgba(0, 243, 255, 0.6)");
});

test("Acessibilidade: nomes acessíveis, foco visível e navegação por teclado", async ({
  page,
}) => {
  await useTheme(page, "light");
  for (const tab of TABS) {
    await page.locator("#tab-btn-" + tab).click();
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll("input, select, textarea, button")]
        .filter((el) => el.checkVisibility())
        .filter(
          (el) =>
            !el.labels?.length &&
            !el.getAttribute("aria-label") &&
            !el.title &&
            !el.textContent.trim(),
        )
        .map((el) => el.outerHTML.slice(0, 80)),
    );
    expect(unnamed).toEqual([]);
  }
  await page.locator("#tab-btn-calc").focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("#module-graph")).toBeVisible();
  const outline = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement);
    return [cs.outlineStyle, cs.outlineColor];
  });
  expect(outline).toEqual(["solid", "rgb(7, 89, 133)"]);
});

test("Teclado físico: funções digitadas, parênteses, potência e porcentagem", async ({
  page,
}) => {
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  for (const [keys, value] of [
    ["sqrt(16)+2^3", "12"],
    ["(1+2)*3!", "18"],
    ["200*10%", "20"],
    ["10/4", "2.5"],
  ]) {
    await page.keyboard.press("Escape");
    await page.keyboard.type(keys);
    await page.keyboard.press("=");
    await expect(page.locator("#calc-main-display")).toHaveText(value);
  }
  for (const d of "0123456789")
    await page.locator(`[onclick="calcInput('${d}')"]`).click();
  await expect(page.locator("#calc-main-display")).toHaveText("0123456789");
});

test("Entradas inválidas exibem mensagens claras em todas as ferramentas", async ({
  page,
}) => {
  for (const expr of [
    "sqrt(",
    "foo(2)",
    "2^5000",
    "tan(pi/2)",
    "1".repeat(1001),
  ]) {
    await page.locator("#expression-input").fill(expr);
    await page.locator("#expression-input").press("Enter");
    await expect(page.locator("#calc-error")).toContainText("Não foi possível");
  }
  await page.locator("summary").filter({ hasText: "ÁLGEBRA //" }).click();
  await page.locator("#quad-a").fill("1");
  await page.locator("#quad-b").fill("0");
  await page.locator("#quad-c").fill("4");
  await page.locator("#quadratic-solve").click();
  await expect(page.locator("#quadratic-result")).toHaveText("2i; -2i");
  await page.locator("#tri-c").fill("200");
  await page.locator("#triangle-solve").click();
  await expect(page.locator("#triangle-result")).toContainText("ângulo");
  await page.locator("summary").filter({ hasText: "ESTATÍSTICA" }).click();
  await page.locator("#stats-x").fill("1, 2, x");
  await page.locator("#statistics-run").click();
  await expect(page.locator("#statistics-result")).toContainText("finitos");
  await page.locator("#stats-x").fill("1 2 3 4");
  await page.locator("#stats-y").fill("2 4 6 8");
  await page.locator("#statistics-run").click();
  await expect(page.locator("#statistics-result")).toContainText(
    '"inclinação": 2',
  );
  await page
    .locator("summary")
    .filter({ hasText: "CONVERSÃO DE BASES" })
    .click();
  await page.locator("#base-number").fill("1012");
  await page.locator("#base-from").selectOption("2");
  await page.locator("#base-convert").click();
  await expect(page.locator("#base-result")).toContainText("incompatível");
  await page
    .locator("summary")
    .filter({ hasText: "FUNÇÕES AVANÇADAS" })
    .click();
  await page.locator("#variables-input").fill("{x:1}");
  await page.locator("#variables-save").click();
  await expect(page.locator("#variables-status")).not.toHaveText(
    "Variáveis definidas",
  );
  await page.locator("#variables-input").fill('{"sin":1}');
  await page.locator("#variables-save").click();
  await expect(page.locator("#variables-status")).toContainText("reservado");
  await page.locator("summary").filter({ hasText: "PERSONALIZADAS" }).click();
  await page.locator("#custom-name").fill("1abc");
  await page.locator("#custom-define").click();
  await expect(page.locator("#custom-status")).toContainText("inválido");

  await page.locator("#tab-btn-graph").click();
  await page.locator("#func-expr").fill("x^2;x;x;x;x");
  await page.locator('[onclick="plotFunctionAndTable()"]').click();
  await expect(page.locator("#graph-error")).toContainText("1 a 4");
  await page.locator("#func-expr").fill("x^2");
  await page.locator("#table-xmin").fill("5");
  await page.locator("#table-xmax").fill("1");
  await page.locator('[onclick="plotFunctionAndTable()"]').click();
  await expect(page.locator("#graph-error")).toContainText("mín < máx");

  await page.locator("#tab-btn-combinatorics").click();
  await page.locator("#comb-n").fill("3");
  await page.locator("#comb-k").fill("5");
  await page.locator('[onclick="calculateCombinatorics()"]').click();
  await expect(page.locator("#comb-results-box")).toContainText("entre 0 e 3");
  await page.locator("#comb-k").fill("2");
  await page.locator("#comb-rep").fill("2,2");
  await page.locator('[onclick="calculateCombinatorics()"]').click();
  await expect(page.locator("#comb-results-box")).toContainText(
    "não pode exceder",
  );
  await page.locator("#comb-n").fill("0");
  await page.locator("#comb-k").fill("0");
  await page.locator("#comb-rep").fill("");
  await page.locator('[onclick="calculateCombinatorics()"]').click();
  await expect(page.locator("#comb-results-box")).toContainText("FATORIAL");

  await page.locator("#tab-btn-calculus").click();
  await page.locator("#calc-func-expr").fill("x^2+1");
  await page.locator("summary").filter({ hasText: "RAÍZES" }).click();
  await page.locator("#root-method").selectOption("bisection");
  await page.locator('[onclick="solveRoot()"]').click();
  await expect(page.locator("#root-result")).toContainText("mudança de sinal");
  await page.locator("#angle-mode").evaluate((s) => {
    s.value = "DEG";
    s.dispatchEvent(new Event("change"));
  });
  await page.locator('[onclick="symbolicDerivative()"]').click();
  await expect(page.locator("#root-result")).toContainText("RAD");
  await page.locator("#calc-func-expr").fill("y+1");
  await page.locator('[onclick="calculateNumerical()"]').click();
  await expect(page.locator("#calculus-results-box")).toContainText(
    "Símbolo não permitido",
  );
});

test("Histórico: exportação JSON contém as expressões calculadas", async ({
  page,
}) => {
  for (const expr of ["2+3", "sqrt(16)"]) {
    await page.locator("#expression-input").fill(expr);
    await page.locator("#expression-input").press("Enter");
  }
  await page.locator("#tab-btn-history").click();
  await expect(page.locator("#full-history-list")).toContainText("sqrt(16)");
  const dl = page.waitForEvent("download");
  await page.getByText("EXPORTAR JSON", { exact: true }).click();
  const data = JSON.parse(fs.readFileSync(await (await dl).path(), "utf8"));
  expect(data.map((d) => [d.expr, d.result])).toEqual([
    ["sqrt(16)", "4"],
    ["2+3", "5"],
  ]);
});
