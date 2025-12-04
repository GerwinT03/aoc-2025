import { readGrid } from "../utils/input.js";
import { runDay } from "../utils/runner.js";

export const input = readGrid(4);

export function part1(grid: string[][]): number {
  let count = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (cell !== "@") continue;
      if (countNeighbors(grid, row, col) < 4) {
        count++;
      }
    }
  }
  return count;
}

export function part2(grid: string[][]): number {
  let count = 0;
  const queue: [number, number][] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === "@" && countNeighbors(grid, row, col) < 4) {
        queue.push([row, col]);
      }
    }
  }

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    if (grid[row][col] !== "@") continue;
    grid[row][col] = "x";
    count++;

    for (const [dr, dc] of NEIGHBORS) {
      const nRow = row + dr;
      const nCol = col + dc;
      if (grid[nRow]?.[nCol] === "@" && countNeighbors(grid, nRow, nCol) < 4) {
        queue.push([nRow, nCol]);
      }
    }
  }
  return count;
}

function countNeighbors(grid: string[][], row: number, col: number): number {
  return NEIGHBORS.reduce(
    (acc, [dr, dc]) => (grid[row + dr]?.[col + dc] === "@" ? acc + 1 : acc),
    0
  );
}

const NEIGHBORS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

export const solution = runDay({ day: 4, input, part1, part2 });
