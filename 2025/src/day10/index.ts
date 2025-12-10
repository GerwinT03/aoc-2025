import { readLines } from "../utils/input.js";
import { runDay } from "../utils/runner.js";

const EPS = 1e-9;

export const input = readLines(10);

export function part1(lines: string[]): number {
  let machines: number[][] = [];
  lines.forEach((line) => {
    const lights: number[] = [];
    const content = line.split("[").pop()?.split("]")[0];
    if (content) {
      for (let i = 0; i < content.length; i++) {
        if (content[i] === "#") {
          lights.push(1);
        } else if (content[i] === ".") {
          lights.push(0);
        }
      }
    }
    machines.push(lights);
  });
  const instructions = lines.map((line) => {
    const matches = line.match(/\(([^)]+)\)/g) || [];
    return matches.map((match) => match.slice(1, -1).split(",").map(Number));
  });

  let sum = 0;
  machines.forEach((machine, index) => {
    const instrs = instructions[index];
    let start = new Array(machine.length).fill(0);
    let minInstructions = Infinity;

    const backtrack = (
      current: number[],
      instrIndex: number,
      usedInstructions: number,
    ) => {
      if (usedInstructions >= minInstructions) {
        return;
      }

      if (instrIndex === instrs.length) {
        if (arraysEqual(current, machine)) {
          minInstructions = Math.min(minInstructions, usedInstructions);
        }
        return;
      }

      // Skip instruction
      backtrack(current, instrIndex + 1, usedInstructions);

      // Apply instruction
      const newCurrent = current.slice();
      for (const idx of instrs[instrIndex]) {
        newCurrent[idx] = newCurrent[idx] === 0 ? 1 : 0;
      }
      backtrack(newCurrent, instrIndex + 1, usedInstructions + 1);
    };

    backtrack(start, 0, 0);
    sum += minInstructions === Infinity ? 0 : minInstructions;
  });

  return sum;
}

export function part2(lines: string[]): number {
  const machines: number[][] = [];
  const allButtons: number[][][] = [];

  lines.forEach((line) => {
    const joltageMatch = line.match(/\{([^}]+)\}/);
    if (!joltageMatch) return;
    const targets = joltageMatch[1].split(",").map(Number);
    machines.push(targets);

    const matches = line.match(/\(([^)]+)\)/g) || [];
    const btns = matches.map((match) =>
      match.slice(1, -1).split(",").map(Number),
    );
    allButtons.push(btns);
  });

  let total = 0;
  for (let i = 0; i < machines.length; i++) {
    total += solveMachine(machines[i], allButtons[i]);
  }

  return total;
}

export const solution = runDay({ day: 10, input, part1, part2 });

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function solveMachine(targets: number[], buttons: number[][]): number {
  const n = targets.length;
  const m = buttons.length;

  // Build augmented matrix for RREF: n rows, m button columns + rhs.
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < m; j++) {
      row.push(buttons[j].includes(i) ? 1 : 0);
    }
    row.push(targets[i]);
    matrix.push(row);
  }

  const { matrix: rref, rank } = reduceToRref(matrix);

  // Inconsistency check.
  for (let i = rank; i < n; i++) {
    if (Math.abs(rref[i][m]) > EPS) {
      return 0;
    }
  }

  // Identify pivot and free columns.
  const pivotCols: number[] = [];
  const isPivot = new Array(m).fill(false);
  for (let r = 0; r < rank; r++) {
    let pivotCol = -1;
    for (let c = 0; c < m; c++) {
      if (Math.abs(rref[r][c]) > EPS) {
        pivotCol = c;
        break;
      }
    }
    if (pivotCol !== -1) {
      pivotCols.push(pivotCol);
      isPivot[pivotCol] = true;
    }
  }

  const freeCols: number[] = [];
  for (let c = 0; c < m; c++) {
    if (!isPivot[c]) freeCols.push(c);
  }

  // Upper bound per free variable: cannot press a button more times than the
  // smallest target of any counter it affects.
  const upperBounds = freeCols.map((col) => {
    let bound = Infinity;
    for (let i = 0; i < n; i++) {
      if (buttons[col].includes(i)) {
        bound = Math.min(bound, targets[i]);
      }
    }
    return Number.isFinite(bound) ? bound : 0;
  });

  let best = Infinity;
  const freeVals = new Array(freeCols.length).fill(0);

  const feasibleRemaining = (partialIdx: number): boolean => {
    for (let r = 0; r < rank; r++) {
      let base = rref[r][m];
      for (let i = 0; i < partialIdx; i++) {
        base -= rref[r][freeCols[i]] * freeVals[i];
      }

      // Max value pivot can reach with remaining (unassigned) free vars.
      let maxReach = base;
      for (let i = partialIdx; i < freeCols.length; i++) {
        const coeff = rref[r][freeCols[i]];
        if (coeff < -EPS) {
          maxReach -= coeff * upperBounds[i];
        }
      }
      if (maxReach < -EPS) return false;
    }
    return true;
  };

  const dfs = (idx: number) => {
    if (!feasibleRemaining(idx)) return;

    if (idx === freeCols.length) {
      const solution = new Array(m).fill(0);
      for (let i = 0; i < freeCols.length; i++) {
        solution[freeCols[i]] = freeVals[i];
      }

      for (let r = 0; r < rank; r++) {
        const pivotCol = pivotCols[r];
        let value = rref[r][m];
        for (let i = 0; i < freeCols.length; i++) {
          value -= rref[r][freeCols[i]] * solution[freeCols[i]];
        }
        const rounded = Math.round(value);
        if (Math.abs(value - rounded) > EPS || rounded < 0) {
          return;
        }
        solution[pivotCol] = rounded;
      }

      const presses = solution.reduce((acc, v) => acc + v, 0);
      if (presses < best) best = presses;
      return;
    }

    const upper = upperBounds[idx];
    for (let v = 0; v <= upper; v++) {
      freeVals[idx] = v;
      if (freeVals.slice(0, idx + 1).reduce((acc, val) => acc + val, 0) >= best)
        continue;
      dfs(idx + 1);
    }
  };

  dfs(0);
  return best === Infinity ? 0 : best;
}

function reduceToRref(mat: number[][]): { matrix: number[][]; rank: number } {
  const rows = mat.length;
  const cols = mat[0].length;
  let r = 0;

  for (let c = 0; c < cols - 1 && r < rows; c++) {
    let pivot = r;
    for (let i = r + 1; i < rows; i++) {
      if (Math.abs(mat[i][c]) > Math.abs(mat[pivot][c])) {
        pivot = i;
      }
    }
    if (Math.abs(mat[pivot][c]) < EPS) continue;

    [mat[r], mat[pivot]] = [mat[pivot], mat[r]];

    const div = mat[r][c];
    for (let j = c; j < cols; j++) {
      mat[r][j] /= div;
    }

    for (let i = 0; i < rows; i++) {
      if (i === r) continue;
      const factor = mat[i][c];
      if (Math.abs(factor) < EPS) continue;
      for (let j = c; j < cols; j++) {
        mat[i][j] -= factor * mat[r][j];
      }
    }

    r++;
  }

  return { matrix: mat, rank: r };
}
