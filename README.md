# Advent of Code 2025

TypeScript solutions for [Advent of Code 2025](https://adventofcode.com/2025).

## Solutions
Day 1 Solution: [Click here](https://github.com/GerwinT03/aoc-2025/blob/master/src/day01/index.ts) <br>


## Setup

```bash
pnpm install
```

## Running Solutions

```bash
pnpm run day 1              # Run day 1 with puzzle input
pnpm run day 1 --example    # Run day 1 with example input
```

## Project Structure

```
src/
├── day01/
│   ├── index.ts      # Solution
│   ├── input.txt     # Puzzle input
│   └── example.txt   # Example input
├── day02/
│   └── ...
└── utils/
    └── input.ts      # Input reading utilities
```

## Utilities

Available in `src/utils/input.ts`:

- `readInput(day)` - Read raw input as string
- `readLines(day)` - Read input as array of lines
- `readNumbers(day)` - Read input as array of numbers
- `readBlocks(day)` - Read input split by blank lines
- `readGrid(day)` - Read input as 2D character grid

The `--example` flag automatically switches to `example.txt` input.
