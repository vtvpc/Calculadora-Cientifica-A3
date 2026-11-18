// Cobertura do inventário: cada função permitida pelo motor tem ao menos um
// caso válido verificado; casos inválidos, limites e precisão por área.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../math-engine"),
  N = require("../numerical"),
  A = require("../advanced"),
  G = require("../graph-scale");

const close = (a, b, tol = 1e-10) =>
  assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} ≠ ${b}`);
const fmt = (expr) => E.format(E.evaluate(expr));
const PI = Math.PI;

// Exemplo válido + resultado esperado para cada nome da allowlist.
const samples = {
  sin: ["sin(pi/6)", 0.5],
  cos: ["cos(pi)", -1],
  tan: ["tan(pi/4)", 1],
  asin: ["asin(1)", PI / 2],
  acos: ["acos(0)", PI / 2],
  atan: ["atan(1)", PI / 4],
  atan2: ["atan2(1,1)", PI / 4],
  sec: ["sec(0)", 1],
  csc: ["csc(pi/2)", 1],
  cot: ["cot(pi/4)", 1],
  asec: ["asec(2)", PI / 3],
  acsc: ["acsc(2)", PI / 6],
  acot: ["acot(1)", PI / 4],
  sinh: ["sinh(1)", Math.sinh(1)],
  cosh: ["cosh(0)", 1],
  tanh: ["tanh(1)", Math.tanh(1)],
  asinh: ["asinh(sinh(2))", 2],
  acosh: ["acosh(1)", 0],
  atanh: ["atanh(0.5)", Math.atanh(0.5)],
  sech: ["sech(0)", 1],
  csch: ["csch(1)", 1 / Math.sinh(1)],
  coth: ["coth(1)", 1 / Math.tanh(1)],
  sqrt: ["sqrt(2)", Math.SQRT2],
  cbrt: ["cbrt(-8)", -2],
  nthRoot: ["nthRoot(32,5)", 2],
  abs: ["abs(-3.5)", 3.5],
  sign: ["sign(-2)", -1],
  log: ["log(8,2)", 3],
  ln: ["ln(e^2)", 2],
  log10: ["log10(1000)", 3],
  exp: ["exp(1)", Math.E],
  pow: ["pow(2,10)", 1024],
  floor: ["floor(-1.5)", -2],
  ceil: ["ceil(1.2)", 2],
  round: ["round(3.14159,2)", 3.14],
  trunc: ["trunc(-1.7)", -1],
  min: ["min(3,1,2)", 1],
  max: ["max(3,1,2)", 3],
  gcd: ["gcd(12,18)", 6],
  lcm: ["lcm(4,6)", 12],
  factorial: ["factorial(5)", 120],
  gamma: ["gamma(5)", 24],
  re: ["re(3+4i)", 3],
  im: ["im(3+4i)", 4],
  arg: ["arg(i)", PI / 2],
  conj: ["conj(2+3i)", "2 - 3i"],
  complex: ["complex(1,2)", "1 + 2i"],
  polar: ["polar(3+4i)", `[5, ${E.format(Math.atan2(4, 3))}]`],
  rect: ["rect(2,0)", 2],
  mean: ["mean([1,2,3])", 2],
  median: ["median([3,1,2])", 2],
  mode: ["mode([1,2,2])", "[2]"],
  variance: ["variance([1,2,3,4])", 5 / 3],
  std: ["std([2,4,4,4,5,5,7,9])", Math.sqrt(32 / 7)],
  quantileSeq: ["quantileSeq([1,2,3,4],0.5)", 2.5],
  sum: ["sum([1,2,3,4,5])", 15],
  prod: ["prod([1,2,3,4])", 24],
  dot: ["dot([1,2,3],[4,5,6])", 32],
  cross: ["cross([1,0,0],[0,1,0])", "[0, 0, 1]"],
  norm: ["norm([3,4])", 5],
  det: ["det([[1,2],[3,4]])", -2],
  inv: ["inv([[2,0],[0,4]])", "[[0.5, 0], [0, 0.25]]"],
  transpose: ["transpose([[1,2]])", "[[1], [2]]"],
  trace: ["trace([[1,2],[3,4]])", 5],
  rank: ["rank([[1,2],[2,4]])", 1],
  rref: ["rref([[2,4],[1,3]])", "[[1, 0], [0, 1]]"],
  lusolve: ["lusolve([[2,0],[0,3]],[[4],[9]])", "[[2], [3]]"],
  identity: ["identity(2)", "[[1, 0], [0, 1]]"],
  eigs: ["eigs([[2,0],[0,3]])", null],
  fraction: ["fraction(0.125)", "1/8"],
  number: ['number("2.5")', 2.5],
  bignumber: ['bignumber("12345678901234567890")+1', "12345678901234567891"],
  unit: ['unit(5,"cm")', "5 cm"],
  to: ['to(unit(72,"km/h"),"m/s")', "20 m / s"],
  isPrime: ["isPrime(97)", "true"],
  combinations: ["combinations(5,2)", 10],
  combinationsWithRep: ["combinationsWithRep(5,3)", 35],
  permutations: ["permutations(5,2)", 20],
  bin: ["bin(10)", '"0b1010"'],
  binomial: ["binomial(10,3,0.5)", 0.1171875],
  normal: ["normal(1,0,1)", Math.exp(-0.5) / Math.sqrt(2 * PI)],
  poisson: ["poisson(2,3)", (9 * Math.exp(-3)) / 2],
  doubleFactorial: ["doubleFactorial(8)", 384],
  factorize: ["factorize(84)", "[2, 2, 3, 7]"],
  fibonacci: ["fibonacci(10)", "55"],
  arithmetic: ["arithmetic(2,3,10)", 29],
  geometric: ["geometric(2,3,5)", 162],
  simpleInterest: ["simpleInterest(1000,0.02,12)", 1240],
  compoundInterest: ["compoundInterest(1000,0.01,12)", 1000 * 1.01 ** 12],
  presentValue: ["presentValue(1100,0.1,1)", 1000],
  payment: ["payment(1000,0.01,12)", (1000 * 0.01) / (1 - Math.pow(1.01, -12))],
  equivalentRate: ["equivalentRate(0.12,12)", Math.pow(1.12, 1 / 12) - 1],
  sac: ["sac(1200,0.01,12,12)", 101],
  periodic: ['periodic(1,"","3")', "4/3"],
  bitAnd: ["bitAnd(6,3)", 2],
  bitOr: ["bitOr(6,3)", 7],
  bitXor: ["bitXor(5,3)", 6],
  bitNot: ["bitNot(5)", -6],
  leftShift: ["leftShift(1,8)", 256],
  rightShift: ["rightShift(256,4)", 16],
};

test("Inventário: toda função da allowlist tem caso de teste e funciona", () => {
  const src = fs.readFileSync(
    path.join(__dirname, "..", "math-engine.js"),
    "utf8",
  );
  const names = src.match(/new Set\(\s*"([^"]+)"/)[1].split(" ");
  names.push("ln");
  const untested = names.filter((n) => !(n in samples));
  assert.deepEqual(untested, [], "Funções sem teste: " + untested);
  E.setAngle("RAD");
  for (const name of names) {
    const [expr, expected] = samples[name];
    const value = E.evaluate(expr);
    if (expected === null) continue;
    if (typeof expected === "number") close(Number(value), expected, 1e-9);
    else assert.equal(E.format(value), expected, expr);
  }
  const eig = E.evaluate("eigs([[2,0],[0,3]])");
  assert.deepEqual(eig.values.toArray?.() ?? eig.values, [2, 3]);
});

test("Calculadora básica: operações, precedência e precisão IEEE 754", () => {
  for (const [expr, v] of [
    ["1+2*3", 7],
    ["(1+2)*3", 9],
    ["7/2", 3.5],
    ["-7 mod 3", 2], // mod matemático: sinal do divisor
    ["7 mod -3", -2],
    ["2^0.5", Math.SQRT2],
    ["1e3+1e-3", 1000.001],
    ["0.1*3", 0.3],
    ["1/3*3", 1],
    ["((((1))))", 1],
    ["3!+4!", 30],
  ])
    close(E.evaluate(expr), v, 1e-12);
  assert.equal(fmt("0.1+0.2"), "0.3"); // formato com 14 dígitos oculta o ruído binário
  for (const bad of ["", "   ", "2+", "*3", "(1+2", "1+2)", "abc", "2 3 +"])
    assert.throws(() => E.evaluate(bad), bad);
  assert.throws(() => E.evaluate("1".repeat(1001)), /longa demais/);
});

test("Trigonometria em DEG e RAD, inclusive pontos indefinidos", () => {
  E.setAngle("DEG");
  close(E.evaluate("sin(90)"), 1);
  close(E.evaluate("cos(60)"), 0.5);
  close(E.evaluate("tan(45)"), 1);
  close(E.evaluate("acos(0.5)"), 60);
  close(E.evaluate("atan(1)"), 45);
  close(E.evaluate("sec(60)"), 2);
  assert.throws(() => E.evaluate("tan(90)"), /indefinida/);
  assert.throws(() => E.evaluate("cot(0)"), /indefinida/);
  E.setAngle("RAD");
  close(E.evaluate("cos(pi/3)"), 0.5);
  assert.throws(() => E.evaluate("tan(pi/2)"), /indefinida/);
  assert.throws(() => E.setAngle("GRAD"));
});

test("Potências, raízes, logaritmos e fatoriais: limites e domínios", () => {
  close(E.evaluate("2^10"), 1024);
  close(E.evaluate("2^-1"), 0.5);
  close(E.evaluate("re((-8)^(1/3))"), 1, 1e-9); // raiz principal complexa
  close(E.evaluate("nthRoot(-27,3)"), -3);
  close(E.evaluate("log(0.001)"), -3);
  close(E.evaluate("log(1024,2)"), 10);
  close(E.evaluate("ln(1)"), 0);
  assert.equal(E.format(E.evaluate("170!")).slice(0, 6), "7.2574");
  close(E.evaluate("0!"), 1);
  for (const bad of ["171!", "(-1)!", "2.5!", "2^1001", "log(0)", "ln(0)"])
    assert.throws(() => E.evaluate(bad), bad);
  assert.equal(E.format(E.evaluate("sqrt(-9)")), "3i");
  close(E.evaluate("im(ln(-1))"), PI); // ramo principal complexo
});

test("Complexos e estatística (incluindo erros de entrada)", () => {
  assert.equal(fmt("(2+3i)*(1-i)"), "5 + i");
  assert.equal(fmt("(1+i)/(1-i)"), "i");
  close(E.evaluate("abs(2*exp(i*pi/3))"), 2);
  close(E.evaluate("re(rect(2,pi/3))"), 1);
  const s = A.statistics([2, 4, 4, 4, 5, 5, 7, 9]);
  close(s.média, 5);
  close(s.desvio_populacional, 2);
  close(s.mediana, 4.5);
  close(s.Q1, 4);
  close(s.Q3, 5.5);
  close(s.amplitude, 7);
  close(
    s.média_geométrica,
    Math.exp(
      (Math.log(2) +
        3 * Math.log(4) +
        2 * Math.log(5) +
        Math.log(7) +
        Math.log(9)) /
        8,
    ),
  );
  assert.equal(A.statistics([5]).variância_amostral, undefined);
  assert.throws(() => A.statistics([]));
  assert.throws(() => A.statistics([1, 2], [], [1]));
  assert.throws(() => A.statistics([1, 2], [], [-1, 2]));
  assert.throws(() => A.dataset(""));
  assert.throws(() => A.dataset(Array(1001).fill(1).join(",")));
  assert.deepEqual(A.dataset("1, 2;3  4"), [1, 2, 3, 4]);
});

test("Combinatória e probabilidades: valores e limites", () => {
  close(E.evaluate("combinations(52,5)"), 2598960);
  close(E.evaluate("permutations(10,3)"), 720);
  close(E.evaluate("binomial(4,0,0.5)"), 1 / 16);
  close(E.evaluate("poisson(0,0)"), 1);
  assert.throws(() => E.evaluate("binomial(5,6,0.5)"));
  assert.throws(() => E.evaluate("binomial(5,2,1.5)"));
  assert.throws(() => E.evaluate("poisson(2,-1)"));
  assert.throws(() => E.evaluate("normal(0,0,0)"));
  assert.throws(() => E.evaluate("combinations(171,2)"));
});

test("Cálculo numérico: derivadas, integrais e métodos de raízes", () => {
  close(N.derivative(N.fn("sin(x)"), 0), 1, 1e-8);
  close(N.derivative(N.fn("exp(x)"), 1, 2), Math.E, 1e-5);
  close(N.integrate(N.fn("sin(x)"), 0, PI), 2, 1e-10);
  close(N.integrate(N.fn("exp(x)"), 0, 1, "trapezoid"), Math.E - 1, 1e-6);
  close(N.integrate(N.fn("1/x"), 1, Math.E), 1, 1e-10);
  close(N.rootFind(N.fn("cos(x)-x"), 0, 1, "newton"), 0.7390851332, 1e-8);
  close(N.rootFind(N.fn("x^3-x-2"), 1, 2, "secant"), 1.5213797068, 1e-8);
  close(N.rootFind(N.fn("x-3"), 3, 5, "bisection"), 3);
  assert.throws(() => N.derivative(N.fn("x"), 0, 3), /Ordem/);
  assert.throws(() => N.integrate(N.fn("x"), 0, 1, "simpson", 3), /ímpar/);
  assert.throws(() => N.integrate(N.fn("x"), 0, Infinity));
  assert.throws(() => N.rootFind(N.fn("x^2+1"), 0, 1, "bisection"), /sinal/);
  assert.throws(() => N.rootFind(N.fn("x^2+1"), 0, 1, "newton"));
  assert.throws(() => N.fn("y+1"));
  assert.throws(() => N.fn("sqrt(x)")(-1), /real/);
});

test("Álgebra, conversões de base e finanças: limites e erros", () => {
  assert.deepEqual(A.quadratic(0, 2, -4), [2]);
  assert.throws(() => A.quadratic(0, 0, 1), /Sem solução/);
  assert.throws(() => A.quadratic(0, 0, 0), /Infinitas/);
  assert.deepEqual(A.quadratic(1, -2, 1), [1, 1]);
  close(A.triangle(1, 1, 60).lado_c, 1);
  close(A.triangle(2, 3, 30).área, 1.5);
  assert.throws(() => A.triangle(1, 1, 180));
  assert.throws(() => A.triangle(-1, 1, 60));
  assert.equal(A.convertBase("11111111", 2, 10), "255");
  assert.equal(A.convertBase("777", 8, 16), "1FF");
  assert.equal(A.convertBase("0", 10, 2), "0");
  assert.equal(
    A.convertBase("123456789012345678901234567890", 10, 16),
    "18EE90FF6C373E0EE4E3F0AD2",
  );
  assert.throws(() => A.convertBase("2", 2, 10), /incompatível/);
  assert.throws(() => A.convertBase("1.5", 10, 2));
  assert.throws(() => A.convertBase("10", 3, 10));
  close(E.evaluate("payment(1200,0.01,12)"), 106.6185464, 1e-8);
  close(E.evaluate("presentValue(1000,0,5)"), 1000);
  assert.throws(() => E.evaluate("payment(1000,0.01,0)"));
  assert.throws(() => E.evaluate("equivalentRate(-1,12)"));
  assert.throws(() => E.evaluate("sac(1200,0.01,12,0)"));
  assert.throws(() => E.evaluate("leftShift(1,32)"));
  close(E.evaluate("1000*(1-10%)*(1-5%)"), 855);
});

test("Conversões de unidades e constantes físicas", () => {
  for (const [expr, out] of [
    ['to(unit(1,"km"),"m")', "1000 m"],
    ['to(unit(1,"L"),"cm^3")', "1000 cm^3"],
    ['to(unit(2,"hour"),"s")', "7200 s"],
    ['to(unit(1,"kWh"),"J")', "3.6e+6 J"],
    ['to(unit(100,"degF"),"degC")', "37.777777777778 degC"],
  ])
    assert.equal(fmt(expr), out);
  close(E.evaluate("c"), 299792458);
  close(E.evaluate("NA*kB"), 8.31446261815324, 1e-12);
  assert.throws(() => E.evaluate('to(unit(1,"s"),"m")'));
});

test("Escala dos eixos do gráfico: passos, sinais, decimais e extremos", () => {
  assert.equal(G.niceStep(20, 10), 2);
  assert.equal(G.niceStep(1, 10), 0.1);
  assert.equal(G.niceStep(7, 5), 2);
  assert.throws(() => G.niceStep(0, 5));
  const t = G.ticks(-10, 10, 10);
  assert.deepEqual(t.labels, [
    "-10",
    "-8",
    "-6",
    "-4",
    "-2",
    "0",
    "2",
    "4",
    "6",
    "8",
    "10",
  ]);
  // Decimais sem ruído de ponto flutuante (0.30000000000000004).
  const d = G.ticks(0, 1, 10);
  assert.deepEqual(d.labels, [
    "0",
    "0.1",
    "0.2",
    "0.3",
    "0.4",
    "0.5",
    "0.6",
    "0.7",
    "0.8",
    "0.9",
    "1",
  ]);
  assert.deepEqual(G.ticks(-1.2, 1.2, 6).labels, [
    "-1",
    "-0.5",
    "0",
    "0.5",
    "1",
  ]);
  // Grandes e pequenos usam notação científica legível.
  const big = G.ticks(0, 5e7, 5);
  assert.ok(
    big.labels.includes("1e7") && big.labels.includes("5e7"),
    big.labels.join(),
  );
  const small = G.ticks(-3e-6, 3e-6, 6);
  assert.ok(
    small.labels.includes("-2e-6") && small.labels.includes("0"),
    small.labels.join(),
  );
  // Faixas totalmente negativas e deslocadas.
  assert.deepEqual(G.ticks(-105, -95, 5).labels, [
    "-104",
    "-102",
    "-100",
    "-98",
    "-96",
  ]);
  assert.deepEqual(G.ticks(1000, 1001, 4).labels, ["1000", "1000.5", "1001"]);
  assert.equal(G.formatTick(-0, 1), "0");
  assert.equal(G.formatTick(1e-17, 0.1), "0");
  for (const [a, b] of [
    [-1e-8, 1e-8],
    [-1e8, 1e8],
    [0.001, 0.002],
    [-3.7, 12.9],
  ]) {
    const r = G.ticks(a, b, 8);
    assert.ok(
      r.values.length >= 2 && r.values.length <= 20,
      `${a}..${b}: ${r.values.length}`,
    );
    assert.ok(r.values.every((v) => v >= a - 1e-12 && v <= b + 1e-12));
    assert.equal(
      new Set(r.labels).size,
      r.labels.length,
      "rótulos duplicados " + r.labels,
    );
  }
});
