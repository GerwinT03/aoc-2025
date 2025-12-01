import fs from "fs";
import path from "path";
import { getYearConfig, defaultYear, YearConfig } from "./config";

export interface DayMetadata {
  title: string;
  stars?: number;
}

export interface DaySolution {
  day: number;
  title: string;
  code: string;
  completed: boolean;
  stars: number; // 0, 1, or 2
  metadata: DayMetadata | null;
}

function readMetadata(metaPath: string): DayMetadata | null {
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  } catch {
    return null;
  }
}

export function getSolutions(year: number = defaultYear): DaySolution[] {
  const yearConfig = getYearConfig(year);
  if (!yearConfig) {
    return [];
  }

  const solutions: DaySolution[] = [];
  const srcDir = path.join(process.cwd(), yearConfig.srcPath);

  for (let day = 1; day <= yearConfig.totalDays; day++) {
    const dayStr = day.toString().padStart(2, "0");
    const dayDir = path.join(srcDir, `day${dayStr}`);
    const indexPath = path.join(dayDir, "index.ts");
    const metaPath = path.join(dayDir, "meta.json");

    let code = "";
    let completed = false;
    let stars = 0;
    let metadata: DayMetadata | null = null;

    if (fs.existsSync(indexPath)) {
      code = fs.readFileSync(indexPath, "utf-8");
      completed = true;
      metadata = readMetadata(metaPath);
      stars = metadata?.stars ?? 0;
    }

    solutions.push({
      day,
      title: metadata?.title || `Day ${day}`,
      code,
      completed,
      stars,
      metadata,
    });
  }

  return solutions;
}

export function getSolution(day: number, year: number = defaultYear): DaySolution | null {
  const solutions = getSolutions(year);
  return solutions.find((s) => s.day === day) || null;
}
