// --- FUNCTION EVALUATOR & CANVAS PLOTTER ---
let graphState = {
  xmin: -10,
  xmax: 10,
  isDragging: false,
  dragStartX: 0,
  expr: "x^2 - 4*x + 3",
};

function plotFunctionAndTable() {
  const tbody = document.getElementById("func-table-body");
  try {
    const expr = document.getElementById("func-expr").value;
    const expressions = expr
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!expressions.length || expressions.length > 4)
      throw Error("Informe de 1 a 4 funções separadas por ;");
    const fs = expressions.map((expr) => Numerical.fn(expr));
    const xmin = readNumber("table-xmin"),
      xmax = readNumber("table-xmax"),
      step = readNumber("table-step");
    if (
      xmin >= xmax ||
      step <= 0 ||
      !Number.isFinite((xmax - xmin) / step) ||
      (xmax - xmin) / step > 1000
    )
      throw Error("Use mín < máx, passo > 0 e no máximo 1001 linhas");
    graphState.expr = expressions[0];
    graphState.functions = fs;
    graphState.xmin = xmin;
    graphState.xmax = xmax;
    const x = readNumber("func-eval-x");
    try {
      document.getElementById("func-eval-result").value = fs[0](x);
    } catch {
      document.getElementById("func-eval-result").value = "Indefinido";
    }
    tbody.replaceChildren();
    const count = Math.floor((xmax - xmin) / step + 1e-10);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i <= count; i++) {
      const x = xmin + i * step;
      let y;
      try {
        y = MathEngine.format(fs[0](x));
      } catch {
        y = "Indefinido";
      }
      const tr = document.createElement("tr");
      tr.className = "hover:bg-cyber-bg";
      for (const value of [MathEngine.format(x), y]) {
        const td = document.createElement("td");
        td.className = "p-2 border-b border-cyber-cardBorder";
        td.textContent = value;
        tr.append(td);
      }
      fragment.append(tr);
    }
    tbody.append(fragment);
    document.getElementById("graph-error").textContent = "";
    renderCanvasGraph();
  } catch (err) {
    document.getElementById("graph-error").textContent = err.message;
  }
}
function resetGraphZoom() {
  plotFunctionAndTable();
}
function exportGraph() {
  const a = document.createElement("a");
  a.download = "cybercalc-grafico.png";
  a.href = document.getElementById("function-canvas").toDataURL("image/png");
  a.click();
}

function graphThemeColors() {
  const css = getComputedStyle(document.documentElement);
  const v = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  return {
    bg: v("--graph-bg", "#12161f"),
    grid: v("--graph-grid-major", "#1f293d"),
    axis: v("--graph-axis", "#00f3ff"),
    axisGlow: Number(v("--graph-axis-glow", "6")),
    label: v("--graph-label", "#b4c2d4"),
    labelBg: v("--graph-label-bg", "rgba(18,22,31,0.8)"),
    curves: [1, 2, 3, 4].map((i) => v(`--graph-curve-${i}`, "#ff007f")),
    curveGlow: Number(v("--graph-curve-glow", "10")),
  };
}

// Escolhe a densidade de marcas para que os rótulos nunca se sobreponham.
function axisTicks(ctx, min, max, pixels, minGap, horizontal) {
  let maxTicks = Math.max(2, Math.floor(pixels / minGap));
  let t = GraphScale.ticks(min, max, maxTicks);
  while (maxTicks > 2) {
    const spacing = (t.step / (max - min)) * pixels;
    const need = horizontal
      ? Math.max(...t.labels.map((l) => ctx.measureText(l).width), 0) + 14
      : 22;
    if (spacing >= need) break;
    maxTicks = Math.max(2, Math.floor(maxTicks / 2));
    t = GraphScale.ticks(min, max, maxTicks);
  }
  return t;
}

function drawTickLabel(ctx, text, x, y, align, baseline, colors) {
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  const w = ctx.measureText(text).width;
  const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
  const top = baseline === "top" ? y : baseline === "bottom" ? y - 13 : y - 6.5;
  ctx.fillStyle = colors.labelBg;
  ctx.fillRect(left - 2, top - 1, w + 4, 14);
  ctx.fillStyle = colors.label;
  ctx.fillText(text, x, y);
}

function renderCanvasGraph() {
  const canvas = document.getElementById("function-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx || !graphState.functions) return;

  // Dimensões em pixels CSS; o buffer acompanha o devicePixelRatio (telas HiDPI).
  const W = canvas.parentElement.clientWidth || 300;
  const H = canvas.parentElement.clientHeight || 380;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = graphThemeColors();
  // Fundo opaco do tema: o PNG exportado fica legível fora da página.
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  const { xmin, xmax } = graphState;

  const curves = [];
  const points = [];
  const numSamples = Math.max(200, Math.round(W));
  let computedYmin = Infinity,
    computedYmax = -Infinity;

  for (const f of graphState.functions) {
    const curve = [];
    for (let i = 0; i <= numSamples; i++) {
      const x = xmin + (i / numSamples) * (xmax - xmin);
      try {
        const y = f(x);
        if (!isNaN(y) && isFinite(y)) {
          points.push({ x, y });
          curve.push({ x, y });
          if (y < computedYmin) computedYmin = y;
          if (y > computedYmax) computedYmax = y;
        }
      } catch {
        curve.push(null);
      }
    }
    curves.push(curve);
  }

  if (points.length === 0) return;
  let ymin = computedYmin;
  let ymax = computedYmax;
  if (ymin === ymax) {
    ymin -= 1;
    ymax += 1;
  }
  const yPadding = (ymax - ymin) * 0.1 || 1;
  ymin -= yPadding;
  ymax += yPadding;

  const mapX = (x) => ((x - xmin) / (xmax - xmin)) * W;
  const mapY = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

  ctx.font = '11px "JetBrains Mono", Consolas, monospace';
  const xt = axisTicks(ctx, xmin, xmax, W, 70, true);
  const yt = axisTicks(ctx, ymin, ymax, H, 40, false);

  // Grade alinhada às marcas numeradas
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const x of xt.values) {
    const px = Math.round(mapX(x)) + 0.5;
    ctx.moveTo(px, 0);
    ctx.lineTo(px, H);
  }
  for (const y of yt.values) {
    const py = Math.round(mapY(y)) + 0.5;
    ctx.moveTo(0, py);
    ctx.lineTo(W, py);
  }
  ctx.stroke();

  // Eixos
  ctx.strokeStyle = colors.axis;
  ctx.shadowColor = colors.axis;
  ctx.shadowBlur = colors.axisGlow;
  ctx.lineWidth = 1.5;
  const zeroY = mapY(0);
  const zeroX = mapX(0);
  const xAxisVisible = zeroY >= 0 && zeroY <= H;
  const yAxisVisible = zeroX >= 0 && zeroX <= W;
  if (xAxisVisible) {
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(W, zeroY);
    ctx.stroke();
  }
  if (yAxisVisible) {
    ctx.beginPath();
    ctx.moveTo(zeroX, 0);
    ctx.lineTo(zeroX, H);
    ctx.stroke();
  }

  // Curvas
  ctx.lineWidth = 2.5;
  curves.forEach((curve, index) => {
    ctx.strokeStyle = colors.curves[index];
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = colors.curveGlow;
    ctx.beginPath();
    let prev = null;
    curve.forEach((pt) => {
      if (!pt) {
        prev = null;
        return;
      }
      const px = mapX(pt.x),
        py = mapY(pt.y);
      // Do not connect a sampled gap or a jump crossing a vertical asymptote.
      if (
        !prev ||
        Math.abs(py - mapY(prev.y)) > H * 0.45 ||
        (prev.y * pt.y < 0 && Math.abs(pt.y - prev.y) > (ymax - ymin) * 0.4)
      )
        ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      prev = pt;
    });
    ctx.stroke();
  });
  ctx.shadowBlur = 0;

  // Numeração dos eixos (desenhada por cima das curvas, com fundo próprio).
  // Se o eixo estiver fora da área visível, os números ficam presos à borda.
  const xLabelRow = !xAxisVisible
    ? zeroY < 0
      ? 4
      : H - 18
    : zeroY > H - 20
      ? zeroY - 18
      : zeroY + 5;
  const axisLineY = Math.min(Math.max(zeroY, 0), H);
  const shownX = [];
  ctx.strokeStyle = colors.axis;
  ctx.lineWidth = 1;
  xt.values.forEach((x, i) => {
    const label = xt.labels[i];
    if (label === "0" && yAxisVisible && xAxisVisible) return;
    const px = mapX(x);
    const w = ctx.measureText(label).width;
    if (px - w / 2 < 2 || px + w / 2 > W - 2) return;
    ctx.beginPath();
    ctx.moveTo(px, axisLineY - 3);
    ctx.lineTo(px, axisLineY + 3);
    ctx.stroke();
    drawTickLabel(ctx, label, px, xLabelRow, "center", "top", colors);
    shownX.push(label);
  });

  const yLabelWidth = Math.max(
    ...yt.labels.map((l) => ctx.measureText(l).width),
    0,
  );
  let yAlign = "left",
    yLabelX = 5;
  if (yAxisVisible) {
    if (zeroX - yLabelWidth - 10 >= 0) {
      yAlign = "right";
      yLabelX = zeroX - 6;
    } else {
      yLabelX = zeroX + 6;
    }
  } else if (zeroX > W) {
    yAlign = "right";
    yLabelX = W - 5;
  }
  const axisLineX = Math.min(Math.max(zeroX, 0), W);
  const shownY = [];
  yt.values.forEach((y, i) => {
    const label = yt.labels[i];
    if (label === "0" && yAxisVisible && xAxisVisible) return;
    const py = mapY(y);
    if (py < 9 || py > H - 9) return;
    // Evita colisão com a linha de números do eixo X.
    if (py > xLabelRow - 9 && py < xLabelRow + 23) return;
    ctx.beginPath();
    ctx.moveTo(axisLineX - 3, py);
    ctx.lineTo(axisLineX + 3, py);
    ctx.stroke();
    drawTickLabel(ctx, label, yLabelX, py, yAlign, "middle", colors);
    shownY.push(label);
  });

  // Origem rotulada uma única vez.
  if (xAxisVisible && yAxisVisible) {
    const ox = zeroX - 6 >= 10 ? zeroX - 6 : zeroX + 6;
    drawTickLabel(
      ctx,
      "0",
      ox,
      xLabelRow,
      zeroX - 6 >= 10 ? "right" : "left",
      "top",
      colors,
    );
    shownX.push("0");
    shownY.push("0");
  }

  graphState.view = {
    xmin,
    xmax,
    ymin,
    ymax,
    width: W,
    height: H,
    xStep: xt.step,
    yStep: yt.step,
    xLabels: shownX,
    yLabels: shownY,
  };

  // Interactive Pan/Zoom
  canvas.onmousedown = (e) => {
    graphState.isDragging = true;
    graphState.dragStartX = e.clientX;
  };

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const currentX = xmin + (mouseX / rect.width) * (xmax - xmin);
    try {
      const currentY = graphState.functions[0](currentX);
      document.getElementById("canvas-coords").innerText =
        `x: ${currentX.toFixed(2)}, y: ${currentY.toFixed(2)}`;
    } catch {
      document.getElementById("canvas-coords").innerText =
        `x: ${currentX.toFixed(2)}, y: -`;
    }

    if (graphState.isDragging) {
      const dx = e.clientX - graphState.dragStartX;
      const xShift =
        (dx / canvas.getBoundingClientRect().width) *
        (graphState.xmax - graphState.xmin);
      graphState.xmin -= xShift;
      graphState.xmax -= xShift;
      graphState.dragStartX = e.clientX;
      renderCanvasGraph();
    }
  };

  window.onmouseup = () => {
    graphState.isDragging = false;
  };

  canvas.onmouseleave = () => {
    graphState.isDragging = false;
  };
  canvas.onwheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const range = graphState.xmax - graphState.xmin;
    if (range * zoomFactor < 1e-8 || range * zoomFactor > 1e8) return;
    const center = graphState.xmin + range / 2;
    graphState.xmin = center - (range * zoomFactor) / 2;
    graphState.xmax = center + (range * zoomFactor) / 2;
    renderCanvasGraph();
  };
}

window.addEventListener("resize", () => {
  if (!document.getElementById("module-graph").classList.contains("hidden"))
    renderCanvasGraph();
});
