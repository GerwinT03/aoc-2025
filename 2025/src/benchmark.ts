import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface PerformanceStats {
  mean: number;
  min: number;
  max: number;
  median: number;
  runs: number;
}

interface PerformanceData {
  part1: PerformanceStats;
  part2?: PerformanceStats;
  benchmarkedAt: string;
  runtime: string;
}

interface MetaJson {
  title?: string;
  stars?: number;
  performance?: PerformanceData;
}

const WARMUP_RUNS = 10;
const BENCHMARK_RUNS = 100;

function calculateStats(times: number[]): PerformanceStats {
  const sorted = [...times].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / sorted.length;
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  return {
    mean: Number(mean.toFixed(4)),
    min: Number(sorted[0].toFixed(4)),
    max: Number(sorted[sorted.length - 1].toFixed(4)),
    median: Number(median.toFixed(4)),
    runs: sorted.length,
  };
}

function formatTime(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}µs`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
}

async function benchmarkDay(day: number): Promise<void> {
  const dayFolder = `day${day.toString().padStart(2, "0")}`;
  const dayDir = join(__dirname, dayFolder);
  const dayFile = join(dayDir, "index.ts");
  const metaFile = join(dayDir, "meta.json");

  if (!existsSync(dayFile)) {
    console.error(`Day ${day} does not exist, skipping...`);
    return;
  }

  console.log(`\n📊 Benchmarking Day ${day.toString().padStart(2, "0")}...`);

  // Import the module
  const fileUrl = pathToFileURL(dayFile).href;
  const module = await import(fileUrl);

  if (!module.part1 || !module.input) {
    console.error(`  ⚠️  Day ${day} missing exports (need: part1, input)`);
    return;
  }

  const { input, part1, part2 } = module;

  // Benchmark Part 1
  console.log(`  Warming up Part 1 (${WARMUP_RUNS} runs)...`);
  for (let i = 0; i < WARMUP_RUNS; i++) {
    part1(input);
  }

  console.log(`  Benchmarking Part 1 (${BENCHMARK_RUNS} runs)...`);
  const part1Times: number[] = [];
  for (let i = 0; i < BENCHMARK_RUNS; i++) {
    const start = performance.now();
    part1(input);
    part1Times.push(performance.now() - start);
  }
  const part1Stats = calculateStats(part1Times);
  console.log(`  ★ Part 1: ${formatTime(part1Stats.mean)} (median: ${formatTime(part1Stats.median)})`);

  // Benchmark Part 2 if exists
  let part2Stats: PerformanceStats | undefined;
  if (part2) {
    console.log(`  Warming up Part 2 (${WARMUP_RUNS} runs)...`);
    for (let i = 0; i < WARMUP_RUNS; i++) {
      part2(input);
    }

    console.log(`  Benchmarking Part 2 (${BENCHMARK_RUNS} runs)...`);
    const part2Times: number[] = [];
    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      part2(input);
      part2Times.push(performance.now() - start);
    }
    part2Stats = calculateStats(part2Times);
    console.log(`  ★ Part 2: ${formatTime(part2Stats.mean)} (median: ${formatTime(part2Stats.median)})`);
  }

  // Read existing meta.json or create new
  let meta: MetaJson = {};
  if (existsSync(metaFile)) {
    try {
      meta = JSON.parse(readFileSync(metaFile, "utf-8"));
    } catch {
      // Start fresh if parse fails
    }
  }

  // Update with performance data
  meta.performance = {
    part1: part1Stats,
    ...(part2Stats && { part2: part2Stats }),
    benchmarkedAt: new Date().toISOString(),
    runtime: `bun ${process.versions.bun || "unknown"}`,
  };

  writeFileSync(metaFile, JSON.stringify(meta, null, 2) + "\n");
  console.log(`  ✓ Saved to meta.json`);
}

// Parse CLI arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: bun run benchmark <day|all>");
  console.error("Examples:");
  console.error("  bun run benchmark 1");
  console.error("  bun run benchmark all");
  process.exit(1);
}

console.log("🏃 Advent of Code 2025 - Benchmark Runner");
console.log(`   Warmup: ${WARMUP_RUNS} runs, Benchmark: ${BENCHMARK_RUNS} runs`);

if (args[0] === "all") {
  // Find all existing days
  for (let day = 1; day <= 25; day++) {
    const dayFolder = `day${day.toString().padStart(2, "0")}`;
    const dayFile = join(__dirname, dayFolder, "index.ts");
    if (existsSync(dayFile)) {
      await benchmarkDay(day);
    }
  }
} else {
  const day = parseInt(args[0], 10);
  if (isNaN(day) || day < 1 || day > 25) {
    console.error(`Invalid day: ${args[0]}`);
    process.exit(1);
  }
  await benchmarkDay(day);
}

console.log("\n✨ Benchmark complete!");
