# Advent of Code 2025

TypeScript solutions for [Advent of Code 2025](https://adventofcode.com/2025).

## Setup

```bash
bun install
```

## Running Solutions

```bash
bun run day 1              # Run day 1
bun run day 1 --example    # Run with example input
bun run day 1-5            # Run days 1 through 5
bun run day 1,3,5          # Run specific days
```

## Generating New Days

```bash
bun run generate 2         # Creates src/day02/ with template files
```

## Project Structure

```
src/
├── day01/
│   ├── index.ts      # Solution
│   ├── input.txt     # Puzzle input
│   ├── example.txt   # Example input
│   └── meta.json     # Metadata (title, stars)
├── utils/
│   ├── input.ts      # Input reading utilities
│   └── runner.ts     # Solution runner with timing
├── run.ts            # CLI for running solutions
└── generate.ts       # CLI for scaffolding new days
```

## Utilities

Available in `src/utils/input.ts`:

- `readInput(day)` - Read raw input as string
- `readLines(day)` - Read input as array of lines
- `readNumbers(day)` - Read input as array of numbers
- `readBlocks(day)` - Read input split by blank lines
- `readGrid(day)` - Read input as 2D character grid

The `--example` flag automatically switches to `example.txt` input.

## Meta Files

Each day can have a `meta.json` file with:

```json
{
  "title": "Day Title",
  "stars": 2
}
```

This is used by the website to display the solution info.
