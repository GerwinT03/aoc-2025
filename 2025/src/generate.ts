import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const args = process.argv.slice(2);
const dayArg = args.find((arg) => !arg.startsWith("--"));

if (!dayArg) {
  console.error("Usage: bun run generate <day>");
  process.exit(1);
}

const day = parseInt(dayArg, 10);
if (isNaN(day) || day < 1 || day > 12) {
  console.error("Day must be a number between 1 and 12");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const dayFolder = `day${day.toString().padStart(2, "0")}`;
const dayPath = join(__dirname, dayFolder);

if (existsSync(dayPath)) {
  console.error(`Day ${day} already exists at ${dayPath}`);
  process.exit(1);
}

const template = `import { readLines } from "../utils/input.js";
import { runDay } from "../utils/runner.js";

export const input = readLines(${day});

export function part1(lines: string[]): number {
  return 0;
}

export function part2(lines: string[]): number {
  return 0;
}

export const solution = runDay({ day: ${day}, input, part1, part2 });
`;

mkdirSync(dayPath, { recursive: true });
writeFileSync(join(dayPath, "index.ts"), template);
writeFileSync(join(dayPath, "input.txt"), "");
writeFileSync(join(dayPath, "example.txt"), "");

console.log(`✨ Created day ${day.toString().padStart(2, "0")} at ${dayPath}`);
console.log(`   - index.ts`);
console.log(`   - input.txt`);
console.log(`   - example.txt`);
