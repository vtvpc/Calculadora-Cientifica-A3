// --- MATRIX ALGEBRA ---
function buildMatricesInputs() {
  try {
    for (const name of ["A", "B"]) {
      const rows = readDimension(`mat${name}-rows`),
        cols = readDimension(`mat${name}-cols`);
      const container = document.getElementById(`mat${name}-container`);
      const previous = new Map(
        [...container.querySelectorAll("input")].map((el) => [el.id, el.value]),
      );
      container.innerHTML = createMatrixInputsHTML(name, rows, cols);
      container.querySelectorAll("input").forEach((el) => {
        if (previous.has(el.id)) el.value = previous.get(el.id);
      });
    }
  } catch (err) {
    document.getElementById("matrix-result-container").textContent =
      err.message;
  }
}
function readDimension(id) {
  const n = readNumber(id);
  if (!Number.isInteger(n) || n < 1 || n > 12)
    throw Error("Dimensões devem ser inteiras entre 1 e 12");
  return n;
}

function createMatrixInputsHTML(name, rows, cols) {
  let html = `<div class="grid gap-1.5" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr));">`;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      html += `<input type="number" id="mat${name}_${i}_${j}" aria-label="Matriz ${name}, linha ${i + 1}, coluna ${j + 1}" value="${i === j ? 1 : 0}" step="any" class="bg-cyber-bg border border-cyber-cardBorder rounded p-1.5 text-xs text-center font-mono text-cyber-text focus:border-cyber-cyan">`;
    }
  }
  html += `</div>`;
  return html;
}

function getMatrixFromInputs(name, rows, cols) {
  const mat = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const val = readNumber(`mat${name}_${i}_${j}`);
      row.push(val);
    }
    mat.push(row);
  }
  return mat;
}

function displayMatrixResult(mat) {
  const container = document.getElementById("matrix-result-container");
  const values = typeof mat === "number" ? [mat] : mat.flat();
  if (values.some((v) => !Number.isFinite(v)))
    throw Error("Resultado fora do limite numérico");
  if (typeof mat === "number") {
    container.innerHTML = `<div class="text-2xl font-bold font-mono text-cyber-green text-glow-green">${mat}</div>`;
    return;
  }
  const rows = mat.length;
  const cols = mat[0].length;
  let html = `<table class="border-collapse font-mono text-xs">`;
  for (let i = 0; i < rows; i++) {
    html += `<tr>`;
    for (let j = 0; j < cols; j++) {
      html += `<td class="border border-cyber-cardBorder px-4 py-2 text-center text-cyber-cyan text-glow-cyan">${Number(mat[i][j].toFixed(4))}</td>`;
    }
    html += `</tr>`;
  }
  html += `</table>`;
  container.innerHTML = html;
}

function matrixOperation(op) {
  try {
    const rA = parseInt(document.getElementById("matA-rows").value);
    const cA = parseInt(document.getElementById("matA-cols").value);
    const rB = parseInt(document.getElementById("matB-rows").value);
    const cB = parseInt(document.getElementById("matB-cols").value);
    ["matA-rows", "matA-cols", "matB-rows", "matB-cols"].forEach(readDimension);
    const scalar = op === "scalar" ? readNumber("matrix-scalar") : 0;

    const A = getMatrixFromInputs("A", rA, cA);
    const B = getMatrixFromInputs("B", rB, cB);

    if (op === "add") {
      if (rA !== rB || cA !== cB)
        throw new Error("Dimensões incompatíveis para soma");
      const res = A.map((row, i) => row.map((val, j) => val + B[i][j]));
      displayMatrixResult(res);
    } else if (op === "sub") {
      if (rA !== rB || cA !== cB)
        throw new Error("Dimensões incompatíveis para subtração");
      const res = A.map((row, i) => row.map((val, j) => val - B[i][j]));
      displayMatrixResult(res);
    } else if (op === "scalar") {
      const res = A.map((row) => row.map((val) => val * scalar));
      displayMatrixResult(res);
    } else if (op === "mul") {
      if (cA !== rB)
        throw new Error("Colunas de A devem equivaler às Linhas de B");
      const res = Array(rA)
        .fill(0)
        .map(() => Array(cB).fill(0));
      for (let i = 0; i < rA; i++) {
        for (let j = 0; j < cB; j++) {
          for (let k = 0; k < cA; k++) {
            res[i][j] += A[i][k] * B[k][j];
          }
        }
      }
      displayMatrixResult(res);
    } else if (["trace", "rank", "rref"].includes(op)) {
      const result = MathEngine.evaluate(`${op}(A)`, { A });
      displayMatrixResult(
        MathEngine.math.isMatrix(result) ? result.toArray() : result,
      );
    } else if (op === "solve") {
      if (rA !== cA || rB !== rA || cB !== 1)
        throw Error("Ax=B requer A quadrada e B com uma coluna");
      let solution;
      try {
        solution = MathEngine.math.lusolve(A, B);
      } catch {
        throw Error("Sistema sem solução única: matriz A singular");
      }
      displayMatrixResult(solution);
    } else if (op === "detA") {
      if (rA !== cA) throw new Error("Matriz A precisa ser quadrada");
      displayMatrixResult(matrixDeterminant(A));
    } else if (op === "transA") {
      const res = Array(cA)
        .fill(0)
        .map((_, j) =>
          Array(rA)
            .fill(0)
            .map((_, i) => A[i][j]),
        );
      displayMatrixResult(res);
    } else if (op === "invA") {
      if (rA !== cA) throw new Error("Matriz A precisa ser quadrada");
      displayMatrixResult(matrixInverse(A));
    }
  } catch (err) {
    document.getElementById("matrix-result-container").textContent =
      err.message;
  }
}

function matrixDeterminant(m) {
  return MathEngine.math.det(m);
}
function matrixInverse(m) {
  try {
    return MathEngine.math.inv(m);
  } catch {
    throw Error("Matriz singular ou não inversível");
  }
}
