/* Escalas "bonitas" para os eixos do gráfico: passos 1, 2, 5 × 10^k,
   marcas alinhadas a múltiplos do passo e rótulos sem ruído de ponto flutuante.
   Módulo puro, compartilhado pela interface e pelos testes em Node. */
(function (root) {
  // Menor passo "bonito" (1, 2, 5 × 10^k) que produz no máximo maxTicks intervalos.
  function niceStep(range, maxTicks) {
    if (!(range > 0) || !Number.isFinite(range))
      throw Error("Intervalo do eixo inválido");
    const target = Math.max(1, maxTicks);
    const raw = range / target;
    const power = 10 ** Math.floor(Math.log10(raw));
    for (const m of [1, 2, 5, 10]) if (m * power >= raw) return m * power;
    return 10 * power;
  }

  // Casas decimais necessárias para representar múltiplos exatos do passo.
  function stepDecimals(step) {
    return Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  }

  function formatTick(value, step) {
    if (Math.abs(value) < step * 1e-6) return "0";
    const abs = Math.abs(value);
    // Valores muito grandes ou muito pequenos usam notação científica curta.
    if (abs >= 1e6 || step < 1e-4) {
      const digits = Math.max(
        0,
        Math.min(6, Math.floor(Math.log10(abs)) - Math.floor(Math.log10(step))),
      );
      return value
        .toExponential(digits)
        .replace(/\.?0+e/, "e")
        .replace("e+", "e");
    }
    let text = value.toFixed(stepDecimals(step));
    if (text.includes(".")) text = text.replace(/\.?0+$/, "");
    return text === "-0" ? "0" : text;
  }

  // Marcas visíveis em [min, max]; recalculadas a cada zoom, pan ou reset.
  function ticks(min, max, maxTicks) {
    const step = niceStep(max - min, maxTicks);
    const first = Math.ceil(min / step - 1e-9);
    const last = Math.floor(max / step + 1e-9);
    const values = [];
    for (let k = first; k <= last && values.length <= 200; k++) {
      // Multiplicar o índice inteiro evita acumular erro (0.1 + 0.2 ...).
      const v = Number((k * step).toPrecision(12));
      values.push(Object.is(v, -0) ? 0 : v);
    }
    return {
      step,
      values,
      labels: values.map((v) => formatTick(v, step)),
    };
  }

  const api = { niceStep, stepDecimals, formatTick, ticks };
  root.GraphScale = api;
  if (typeof module === "object") module.exports = api;
})(typeof globalThis === "object" ? globalThis : window);
