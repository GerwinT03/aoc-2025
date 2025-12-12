import { readInput } from "../utils/input.js";
import { runDay } from "../utils/runner.js";

export const input = readInput(12);

export function part1(input: string): number {
  const lines = input.split("\n");
  const shapeSizes: number[] = [];
  let i = 0;

  while (i < lines.length && shapeSizes.length < 6) {
    const line = lines[i].trim();
    if (/^\d+:$/.test(line)) {
      let size = 0;
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^\d+:$/.test(lines[i].trim()) &&
        !/^\d+x\d+:/.test(lines[i].trim())
      ) {
        size += [...lines[i]].filter((c) => c === "#").length;
        i++;
      }
      shapeSizes.push(size);
    } else {
      i++;
    }
  }

  let count = 0;

  for (const line of lines) {
    if (!/^\d+x\d+:/.test(line.trim())) continue;

    const nums = line.match(/-?\d+/g)?.map(Number);
    if (!nums || nums.length < 8) continue;

    const width = nums[0];
    const height = nums[1];
    const area = width * height;

    let cellsNeeded = 0;
    for (let j = 0; j < 6; j++) {
      cellsNeeded += shapeSizes[j] * nums[j + 2];
    }

    if (area > cellsNeeded) {
      count++;
    }
  }

  return count;
}

export const solution = runDay({ day: 12, input, part1 });

// =============================================================================
// Alternate "real" solution using backtracking (works for example, won't complete for real input)
// =============================================================================

type Point = { x: number; y: number };
type Shape = Point[];

type ShapeGroup = {
  masks: bigint[];
  count: number;
  cellCount: number;
  minBitRanges: Map<number, [number, number]>;
};

type GridConfig = {
  width: number;
  height: number;
  placements: number[];
};

export function part1Backtracking(input: string): number {
  const shapes = parseShapes(input);
  const grids = parseGrids(input);

  let count = 0;
  for (const grid of grids) {
    const groups: ShapeGroup[] = [];

    for (let id = 0; id < grid.placements.length; id++) {
      const amount = grid.placements[id];
      const shape = shapes.get(id);
      if (!shape || amount === 0) continue;

      const variants = getShapeVariants(shape);
      const { masks, minBitRanges } = precomputeMasks(
        variants,
        grid.width,
        grid.height,
      );
      groups.push({
        masks,
        count: amount,
        cellCount: shape.length,
        minBitRanges,
      });
    }

    groups.sort((a, b) => b.cellCount - a.cellCount);

    let totalCellsNeeded = 0;
    for (const group of groups) {
      totalCellsNeeded += group.cellCount * group.count;
    }

    const totalCells = grid.width * grid.height;

    if (totalCellsNeeded > totalCells) {
      continue;
    }

    if (canPlaceAll(0n, groups, 0, 0, totalCells, totalCellsNeeded, 0)) {
      count++;
    }
  }

  return count;
}

function parseShapes(input: string): Map<number, Shape> {
  const shapes = new Map<number, Shape>();
  const lines = input.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (/^\d+:$/.test(line)) {
      const id = parseInt(line.replace(":", ""));
      const gridLines: string[] = [];

      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^\d+:$/.test(lines[i].trim()) &&
        !/^\d+x\d+:/.test(lines[i].trim())
      ) {
        gridLines.push(lines[i]);
        i++;
      }

      const height = gridLines.length;
      const width = gridLines[0].length;
      const originY = Math.floor(height / 2);
      const originX = Math.floor(width / 2);

      const points: Point[] = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (gridLines[y][x] === "#") {
            points.push({
              x: x - originX,
              y: y - originY,
            });
          }
        }
      }

      shapes.set(id, points);
    } else {
      i++;
    }
  }

  return shapes;
}

function parseGrids(input: string): GridConfig[] {
  const grids: GridConfig[] = [];
  const lines = input.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    if (!/^\d+x\d+:/.test(line.trim())) continue;

    const [sizeStr, placementsStr] = line.split(":");
    if (!placementsStr) continue;
    const [width, height] = sizeStr.trim().split("x").map(Number);
    const placements = placementsStr.trim().split(" ").map(Number);

    grids.push({ width, height, placements });
  }

  return grids;
}

function getShapeVariants(shape: Shape): Shape[] {
  const variants: Shape[] = [];
  const seen = new Set<string>();

  let current = shape;
  for (let flip = 0; flip < 2; flip++) {
    for (let rot = 0; rot < 4; rot++) {
      const normalized = normalizeShape(current);
      const key = JSON.stringify(normalized);
      if (!seen.has(key)) {
        seen.add(key);
        variants.push(normalized);
      }
      current = rotateShape(current);
    }
    current = flipShape(shape);
  }

  return variants;
}

function normalizeShape(shape: Shape): Shape {
  const minX = Math.min(...shape.map((p) => p.x));
  const minY = Math.min(...shape.map((p) => p.y));
  return shape
    .map((p) => ({ x: p.x - minX, y: p.y - minY }))
    .sort((a, b) => a.y - b.y || a.x - b.x);
}

function rotateShape(shape: Shape): Shape {
  return shape.map((p) => ({ x: -p.y, y: p.x }));
}

function flipShape(shape: Shape): Shape {
  return shape.map((p) => ({ x: -p.x, y: p.y }));
}

function precomputeMasks(
  variants: Shape[],
  width: number,
  height: number,
): {
  masks: bigint[];
  minBitRanges: Map<number, [number, number]>;
} {
  const seen = new Set<bigint>();
  const maskPositions: { mask: bigint; minPos: number }[] = [];

  for (const variant of variants) {
    const maxX = Math.max(...variant.map((p) => p.x));
    const maxY = Math.max(...variant.map((p) => p.y));

    for (let y = 0; y <= height - maxY - 1; y++) {
      for (let x = 0; x <= width - maxX - 1; x++) {
        let mask = 0n;
        let minPos = Infinity;
        for (const point of variant) {
          const pos = (y + point.y) * width + (x + point.x);
          mask |= 1n << BigInt(pos);
          minPos = Math.min(minPos, pos);
        }
        if (!seen.has(mask)) {
          seen.add(mask);
          maskPositions.push({ mask, minPos });
        }
      }
    }
  }

  maskPositions.sort((a, b) => a.minPos - b.minPos);

  const masks = maskPositions.map((m) => m.mask);

  const minBitRanges = new Map<number, [number, number]>();
  let i = 0;
  while (i < maskPositions.length) {
    const bit = maskPositions[i].minPos;
    const start = i;
    while (i < maskPositions.length && maskPositions[i].minPos === bit) {
      i++;
    }
    minBitRanges.set(bit, [start, i]);
  }

  return { masks, minBitRanges };
}

function findFirstEmptyBit(
  grid: bigint,
  totalBits: number,
  startFrom: number,
): number {
  for (let i = startFrom; i < totalBits; i++) {
    if ((grid & (1n << BigInt(i))) === 0n) {
      return i;
    }
  }
  return -1;
}

function canPlaceAny(
  grid: bigint,
  group: ShapeGroup,
  firstEmpty: number,
): boolean {
  for (const [minBit, [start, end]] of group.minBitRanges) {
    if (minBit < firstEmpty) continue;
    for (let i = start; i < end; i++) {
      if ((grid & group.masks[i]) === 0n) {
        return true;
      }
    }
  }
  return false;
}

function canPlaceAll(
  grid: bigint,
  groups: ShapeGroup[],
  groupIndex: number,
  minPos: number,
  totalBits: number,
  cellsNeeded: number,
  firstEmptyHint: number,
): boolean {
  while (groupIndex < groups.length && groups[groupIndex].count === 0) {
    groupIndex++;
    minPos = 0;
  }

  if (groupIndex >= groups.length) {
    return true;
  }

  const firstEmpty = findFirstEmptyBit(grid, totalBits, firstEmptyHint);
  if (firstEmpty === -1) {
    return groupIndex >= groups.length;
  }

  if (!canPlaceAny(grid, groups[groupIndex], firstEmpty)) {
    return false;
  }

  for (let g = groupIndex; g < groups.length; g++) {
    if (groups[g].count === 0) continue;

    const group = groups[g];
    const masks = group.masks;
    const range = group.minBitRanges.get(firstEmpty);

    if (!range) continue;

    const [rangeStart, rangeEnd] = range;
    const start = g === groupIndex ? Math.max(minPos, rangeStart) : rangeStart;

    for (let i = start; i < rangeEnd; i++) {
      const mask = masks[i];

      if ((grid & mask) === 0n) {
        const newGrid = grid | mask;
        group.count--;

        const nextGroup = group.count > 0 ? g : groupIndex;
        const nextMinPos = group.count > 0 ? i : 0;

        if (
          canPlaceAll(
            newGrid,
            groups,
            nextGroup,
            nextMinPos,
            totalBits,
            cellsNeeded - group.cellCount,
            firstEmpty,
          )
        ) {
          group.count++;
          return true;
        }

        group.count++;
      }
    }
  }

  return false;
}
