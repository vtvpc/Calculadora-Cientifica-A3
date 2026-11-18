// Auditoria de contraste WCAG executada dentro da página (Playwright page.evaluate).
// Para cada elemento visível com texto próprio, compõe as cores de fundo
// semitransparentes dos ancestrais e calcula a razão de contraste do texto.
function auditContrast() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const background = (el) => {
    const layers = [];
    for (
      let node = el;
      node && node.nodeType === 1;
      node = node.parentElement
    ) {
      const cs = getComputedStyle(node);
      // Gradiente do botão vermelho: usa a cor mais clara (pior caso).
      if (/gradient/.test(cs.backgroundImage) && node !== document.body) {
        const stops = [...cs.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(
          (m) => parse(m[0]),
        );
        if (stops.length) {
          layers.push(stops.sort((p, q) => lum(q) - lum(p))[0]);
          break;
        }
      }
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) layers.push(bg);
      if (bg && bg.a === 1) break;
    }
    let color = { r: 255, g: 255, b: 255, a: 1 };
    for (const layer of layers.reverse()) color = over(layer, color);
    return color;
  };
  const failures = [];
  let checked = 0;
  for (const el of document.querySelectorAll("body *")) {
    if (["SCRIPT", "STYLE", "CANVAS", "OPTION", "svg"].includes(el.tagName))
      continue;
    const ownText = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join("");
    const isField = ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    if (!ownText && !(isField && el.value)) continue;
    if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
      continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const cs = getComputedStyle(el);
    const bg = background(el);
    const fg = over(parse(cs.color), bg);
    const size = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const min = large ? 3 : 4.5;
    const r = ratio(fg, bg);
    checked++;
    if (r < min)
      failures.push(
        `${el.tagName}#${el.id || ""}.${String(el.className).slice(0, 40)} "${(ownText || el.value).slice(0, 30)}" ${r.toFixed(2)} < ${min}`,
      );
  }
  return { checked, failures };
}
module.exports = { auditContrast };
