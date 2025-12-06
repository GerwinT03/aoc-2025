import { readGrid } from "../utils/input.js";
import { runDay } from "../utils/runner.js";

export const input = readGrid(6);

export function part1(grid: string[][]): number {
  let sum = 0;

  for (const { start, end, operator } of findProblems(grid)) {
    const values = grid.slice(0, -1)
      .map(row => row.slice(start, end).join('').trim())
      .map(Number);

    sum += calculateResult(operator, values);
  }

  return sum;
}

export function part2(grid: string[][]): number {
  let sum = 0;

  for (const { start, end, operator } of findProblems(grid)) {
    const numbers: number[] = [];

    for (let c = end - 1; c >= start; c--) {
      const digits = grid.slice(0, -1)
        .map(row => row[c])
        .filter(char => char >= '0' && char <= '9')
        .join('');

      if (digits) numbers.push(parseInt(digits));
    }

    sum += calculateResult(operator, numbers);
  }

  return sum;
}

export const solution = runDay({ day: 6, input, part1, part2 });

function findProblems(grid: string[][]) {
  const problems: { start: number; end: number; operator: string }[] = [];
  const width = grid[0].length;
  const dataRows = grid.slice(0, -1);
  const operatorRow = grid[grid.length - 1];
  let col = 0;

  while (col < width) {
    // Skip separator columns
    while (col < width && dataRows.every(row => row[col] === ' ')) col++;
    if (col >= width) break;

    // Find problem boundaries
    const start = col;
    while (col < width && !dataRows.every(row => row[col] === ' ')) col++;

    const operator = operatorRow.slice(start, col).join('').trim();
    problems.push({ start, end: col, operator });
  }

  return problems;
}

function calculateResult(operator: string, values: number[]): number {
  if (operator === "+") return values.reduce((sum, val) => sum + val, 0);
  if (operator === "*") return values.reduce((product, val) => product * val, 1);
  return 0;
}

