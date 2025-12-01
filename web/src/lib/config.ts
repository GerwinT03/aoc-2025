export interface YearConfig {
  year: number;
  totalDays: number;
  maxStars: number;
  srcPath: string; // relative path from web folder to src folder
  language: "typescript" | "csharp";
  filePattern: "ts" | "csharp";
}

export const years: YearConfig[] = [
  {
    year: 2025,
    totalDays: 12,
    maxStars: 24,
    srcPath: "../2025/src",
    language: "typescript",
    filePattern: "ts",
  },
  {
    year: 2024,
    totalDays: 25,
    maxStars: 50,
    srcPath: "../2024",
    language: "csharp",
    filePattern: "csharp",
  },
];

export const defaultYear = 2025;

export function getYearConfig(year: number): YearConfig | undefined {
  return years.find((y) => y.year === year);
}

export function getAvailableYears(): number[] {
  return years.map((y) => y.year).sort((a, b) => b - a);
}
