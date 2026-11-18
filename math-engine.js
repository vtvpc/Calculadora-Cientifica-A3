/* Math.js is exposed only through an allowlisted, bounded expression tree. */
(function (root) {
  const m = typeof module === "object" ? require("mathjs") : root.math;
  const functions = new Set(
    "sin cos tan asin acos atan atan2 sec csc cot asec acsc acot sinh cosh tanh asinh acosh atanh sech csch coth sqrt cbrt nthRoot abs sign log log10 exp pow floor ceil round trunc min max gcd lcm factorial gamma re im arg conj complex polar rect mean median mode variance std quantileSeq sum prod dot cross norm det inv transpose trace rank rref lusolve identity eigs fraction number bignumber unit to isPrime combinations combinationsWithRep permutations bin binomial normal poisson doubleFactorial factorize fibonacci arithmetic geometric simpleInterest compoundInterest presentValue payment equivalentRate sac periodic bitAnd bitOr bitXor bitNot leftShift rightShift".split(
      " ",
    ),
  );
  const constants = {
    pi: m.pi,
    e: m.e,
    i: m.complex(0, 1),
    c: 299792458,
    g0: 9.80665,
    hPlanck: 6.62607015e-34,
    kB: 1.380649e-23,
    NA: 6.02214076e23,
  };
  let angle = "RAD";
  const userFunctions = new Map();
  let evaluationDepth = 0,
    operationBudget = 0;
  function finite(value) {
    if (typeof value === "number" && !Number.isFinite(value))
      throw Error("Resultado indefinido ou fora do limite numérico");
    if (
      m.isComplex(value) &&
      (!Number.isFinite(value.re) || !Number.isFinite(value.im))
    )
      throw Error("Resultado complexo indefinido");
    if (m.isUnit(value)) finite(value.value);
    if (m.isBigNumber(value) && !value.isFinite())
      throw Error("Número fora do limite");
    if (Array.isArray(value)) value.forEach(finite);
    if (m.isMatrix(value)) finite(value.toArray());
    else if (
      value &&
      typeof value === "object" &&
      !m.isComplex(value) &&
      !m.isBigNumber(value) &&
      !m.isFraction(value) &&
      !m.isUnit(value) &&
      !Array.isArray(value)
    )
      Object.values(value).forEach(finite);
    return value;
  }
  function integer(n, max = 1000) {
    if (!Number.isSafeInteger(n) || n < 0 || n > max)
      throw Error(`Use inteiro entre 0 e ${max}`);
    return n;
  }
  const extra = {
    doubleFactorial: (n) => {
      integer(n, 300);
      let r = 1;
      for (let j = n; j > 1; j -= 2) r *= j;
      return r;
    },
    factorize: (n) => {
      integer(n, 1e9);
      if (n < 2) throw Error("Use inteiro ≥ 2");
      const factors = [];
      for (let d = 2; d * d <= n; d++) {
        while (n % d === 0) {
          factors.push(d);
          n /= d;
        }
      }
      if (n > 1) factors.push(n);
      return factors;
    },
    bignumber: (value) => {
      if (
        String(value).length > 120 ||
        Math.abs(Number(String(value).split(/[eE]/)[1] || 0)) > 1000
      )
        throw Error("BigNumber limitado a 120 caracteres e expoente ±1000");
      return m.bignumber(value);
    },
    log: (x, base = 10) => m.log(x, base),
    ln: (x) => m.log(x),
    isPrime: (n) => {
      integer(n, 1e9);
      if (n < 2) return false;
      for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
      return true;
    },
    normal: (x, mu = 0, sigma = 1) => {
      if (sigma <= 0) throw Error("Desvio padrão deve ser positivo");
      return (
        Math.exp(-0.5 * ((x - mu) / sigma) ** 2) /
        (sigma * Math.sqrt(2 * Math.PI))
      );
    },
    binomial: (n, k, p) => {
      integer(n);
      integer(k, n);
      if (p < 0 || p > 1) throw Error("Probabilidade deve estar entre 0 e 1");
      return m.combinations(n, k) * p ** k * (1 - p) ** (n - k);
    },
    poisson: (k, lambda) => {
      integer(k, 170);
      if (lambda < 0) throw Error("λ deve ser não negativo");
      return (lambda ** k * Math.exp(-lambda)) / m.factorial(k);
    },
    fibonacci: (n) => {
      integer(n);
      let a = 0n,
        b = 1n;
      for (let j = 0; j < n; j++) [a, b] = [b, a + b];
      return m.bignumber(a.toString());
    },
    arithmetic: (a, d, n) => {
      integer(n);
      return a + (n - 1) * d;
    },
    geometric: (a, r, n) => {
      integer(n);
      return a * r ** (n - 1);
    },
    simpleInterest: (p, r, n) => p * (1 + r * n),
    compoundInterest: (p, r, n) => p * (1 + r) ** n,
    presentValue: (f, r, n) => f / (1 + r) ** n,
    payment: (p, r, n) => {
      if (n <= 0 || r <= -1) throw Error("Prazo/taxa inválidos");
      return r === 0 ? p / n : (p * r) / -Math.expm1(-n * Math.log1p(r));
    },
    equivalentRate: (r, n) => {
      if (r <= -1 || n <= 0) throw Error("Taxa/período inválidos");
      return Math.expm1(Math.log1p(r) / n);
    },
    sac: (p, r, n, k) => {
      integer(n);
      integer(k, n);
      if (n === 0 || k === 0) throw Error("Parcelas começam em 1");
      return p / n + (p - ((k - 1) * p) / n) * r;
    },
    periodic: (whole, nonrepeat, repeat) => {
      if (!/^\d+$/.test(String(repeat)) || !/^\d*$/.test(String(nonrepeat)))
        throw Error("Dígitos inválidos");
      const d = 10n ** BigInt(String(nonrepeat).length),
        q = 10n ** BigInt(String(repeat).length) - 1n;
      return m.fraction(
        (
          BigInt(whole) * d * q +
          BigInt(nonrepeat || 0) * q +
          BigInt(repeat)
        ).toString(),
        (d * q).toString(),
      );
    },
    bitAnd: (a, b) => a & b,
    bitOr: (a, b) => a | b,
    bitXor: (a, b) => a ^ b,
    bitNot: (a) => ~a,
    leftShift: (a, b) => a << integer(b, 31),
    rightShift: (a, b) => a >> integer(b, 31),
    // Listadas na allowlist, mas ausentes no math.js: implementadas aqui.
    trunc: (x) => finite(m.fix(x)),
    // polar(z) → [módulo, argumento em radianos]; rect(r, θ) → r·e^(iθ) (θ em radianos).
    polar: (z) => {
      const c = m.complex(z);
      return [finite(m.abs(c)), finite(m.arg(c))];
    },
    rect: (r, theta) => {
      if (typeof r !== "number" || typeof theta !== "number")
        throw Error("rect requer módulo e ângulo reais");
      return finite(m.complex({ r, phi: theta }));
    },
  };
  functions.add("ln");
  // Row reduction with partial pivoting; values below 1e-12 are treated as zero.
  extra.rref = (input) => {
    const a = m
      .matrix(input)
      .toArray()
      .map((r) => r.slice());
    let row = 0;
    for (let col = 0; col < a[0].length && row < a.length; col++) {
      let p = row;
      for (let j = row + 1; j < a.length; j++)
        if (Math.abs(a[j][col]) > Math.abs(a[p][col])) p = j;
      if (Math.abs(a[p][col]) < 1e-12) continue;
      [a[row], a[p]] = [a[p], a[row]];
      const v = a[row][col];
      a[row] = a[row].map((x) => x / v);
      for (let j = 0; j < a.length; j++)
        if (j !== row) {
          const v = a[j][col];
          a[j] = a[j].map((x, k) => x - v * a[row][k]);
        }
      row++;
    }
    return m.matrix(a);
  };
  extra.rank = (a) =>
    extra
      .rref(a)
      .toArray()
      .filter((r) => r.some((x) => Math.abs(x) > 1e-10)).length;
  function scopeFor(vars = {}) {
    const scope = new Map(Object.entries(constants));
    for (const name of functions)
      if (typeof m[name] === "function")
        scope.set(name, (...args) => finite(m[name](...args)));
    for (const [name, fn] of Object.entries(extra)) scope.set(name, fn);
    for (const [name, fn] of userFunctions) scope.set(name, fn);
    for (const name of ["sin", "cos", "tan", "sec", "csc", "cot"])
      scope.set(name, (x) => {
        const a = angle === "DEG" ? m.multiply(x, Math.PI / 180) : x;
        if (
          typeof a === "number" &&
          ((["tan", "sec"].includes(name) && Math.abs(Math.cos(a)) < 1e-14) ||
            (["csc", "cot"].includes(name) && Math.abs(Math.sin(a)) < 1e-14))
        )
          throw Error("Função trigonométrica indefinida neste ângulo");
        return finite(m[name](a));
      });
    for (const name of ["asin", "acos", "atan", "asec", "acsc", "acot"])
      scope.set(name, (x) =>
        angle === "DEG" ? m.multiply(m[name](x), 180 / Math.PI) : m[name](x),
      );
    for (const [name, value] of Object.entries(vars)) {
      if (
        !/^[A-Za-z][A-Za-z0-9_]*$/.test(name) ||
        functions.has(name) ||
        name in constants
      )
        throw Error("Nome de variável reservado ou inválido");
      scope.set(name, finite(value));
    }
    return scope;
  }
  function expandPercent(expr) {
    const tokens =
      expr.match(
        /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?|[a-zA-Z_][a-zA-Z0-9_]*|\S/g,
      ) || [];
    const out = [];
    for (const token of tokens) {
      if (token !== "%") {
        out.push(token);
        continue;
      }
      let start = out.length - 1;
      while (out[start] === "!") start--;
      if (start < 0) throw Error("Porcentagem requer um operando");
      if ([")", "]"].includes(out[start])) {
        const close = out[start],
          open = close === ")" ? "(" : "[";
        let level = 1;
        while (--start >= 0) {
          if (out[start] === close) level++;
          if (out[start] === open && !--level) break;
        }
        if (start < 0) throw Error("Parênteses incompletos");
        if (start > 0 && functions.has(out[start - 1])) start--;
      }
      const operand = out.splice(start).join(" ");
      out.push("(", operand, "/", "100", ")");
    }
    return out.join(" ");
  }
  function compile(expr, vars = {}) {
    if (typeof expr !== "string" || !expr.trim() || expr.length > 1000)
      throw Error("Expressão vazia ou longa demais (máximo 1000 caracteres)");
    expr = expr
      .replace(/π/g, "pi")
      .replace(/²/g, "^2")
      .replace(/³/g, "^3")
      .replace(/×/g, "*")
      .replace(/÷/g, "/");
    // Each token operand% means operand / 100, including before + or -.
    expr = expandPercent(expr);
    const node = m.parse(expr);
    let count = 0;
    node.traverse((n) => {
      if (++count > 200) throw Error("Expressão complexa demais");
      if (
        ![
          "ConstantNode",
          "SymbolNode",
          "OperatorNode",
          "ParenthesisNode",
          "FunctionNode",
          "ArrayNode",
        ].includes(n.type)
      )
        throw Error("Sintaxe não permitida");
      if (
        n.isSymbolNode &&
        !functions.has(n.name) &&
        !(n.name in constants) &&
        !Object.hasOwn(vars, n.name) &&
        !["x", "Ans", "percent"].includes(n.name)
      )
        throw Error(`Símbolo não permitido: ${n.name}`);
      if (n.isFunctionNode && (!n.fn.isSymbolNode || !functions.has(n.fn.name)))
        throw Error("Função não permitida");
      if (
        n.isOperatorNode &&
        !["+", "-", "*", "/", "^", "!", "mod"].includes(n.op)
      )
        throw Error("Operador não permitido");
      if (
        n.isConstantNode &&
        typeof n.value === "string" &&
        (n.value.length > 120 || /[eE][+-]?\d{5,}/.test(n.value))
      )
        throw Error("Texto ou expoente longo demais");
      if (
        n.isConstantNode &&
        typeof n.value === "number" &&
        !Number.isFinite(n.value)
      )
        throw Error("Número fora do limite");
      if (n.isArrayNode && n.items.length > 20)
        throw Error("Limite de dimensão: 20");
    });
    // Validate cost-sensitive calls and exponents at evaluation time too.
    function cost(n, scope) {
      n.forEach((child) => cost(child, scope));
      if (
        (n.isOperatorNode && n.op === "^") ||
        (n.isFunctionNode && n.fn.name === "pow")
      ) {
        if (n.args.length !== 2) throw Error("Potência requer dois argumentos");
        const b = n.args[1].compile().evaluate(scope);
        if (typeof b !== "number" || Math.abs(b) > 1000)
          throw Error("Expoente limitado a ±1000");
      }
      if (n.isFunctionNode && n.fn.name === "pow" && n.args.length !== 2)
        throw Error("pow requer dois argumentos");
      if (n.isOperatorNode && n.op === "!")
        integer(n.args[0].compile().evaluate(scope), 170);
      if (n.isFunctionNode) {
        if (
          [
            "factorial",
            "identity",
            "combinations",
            "combinationsWithRep",
            "permutations",
          ].includes(n.fn.name)
        )
          integer(
            n.args[0].compile().evaluate(scope),
            n.fn.name === "identity" ? 20 : 170,
          );
        if (
          [
            "bignumber",
            "fraction",
            "unit",
            "to",
            "simplify",
            "derivative",
            "periodic",
            "format",
          ].includes(n.fn.name) &&
          n.args.some(
            (a) =>
              a.isConstantNode &&
              typeof a.value === "string" &&
              a.value.length > 120,
          )
        )
          throw Error("Argumento longo demais");
      }
    }
    const compiled = node.compile();
    return (values) => {
      if (evaluationDepth === 0) operationBudget = 10000;
      evaluationDepth++;
      try {
        operationBudget -= count;
        if (operationBudget <= 0) throw Error("Limite de operações excedido");
        const scope = scopeFor({ ...vars, ...values });
        scope.set("percent", 0.01);
        cost(node, scope);
        return finite(compiled.evaluate(scope));
      } finally {
        evaluationDepth--;
      }
    };
  }
  const api = {
    defineFunction: (name, expr) => {
      if (
        !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name) ||
        functions.has(name) ||
        name in constants ||
        ["x", "Ans", "percent"].includes(name)
      )
        throw Error("Nome reservado ou inválido");
      if (userFunctions.size >= 5)
        throw Error("Limite de 5 funções por sessão");
      const f = compile(expr, { x: 0 });
      userFunctions.set(name, (x) => f({ x }));
      functions.add(name);
    },
    compile,
    evaluate: (expr, vars = {}) => compile(expr, vars)({}),
    real: (expr, x, vars = {}) => {
      const value = compile(expr, vars)({ x });
      if (typeof value !== "number" || !Number.isFinite(value))
        throw Error("A função deve produzir um número real finito");
      return value;
    },
    format: (value) =>
      m.isBigNumber(value)
        ? value.toString()
        : m.isFraction(value)
          ? value.toFraction()
          : m.format(value, { precision: 14 }),
    setAngle: (value) => {
      if (!["RAD", "DEG"].includes(value)) throw Error("Ângulo inválido");
      angle = value;
    },
    integer,
    math: m,
  };
  root.MathEngine = api;
  if (typeof module === "object") module.exports = api;
})(typeof globalThis === "object" ? globalThis : window);
