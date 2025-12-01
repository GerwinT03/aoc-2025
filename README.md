# Advent of Code

TypeScript solutions for [Advent of Code](https://adventofcode.com/) with a Next.js website to showcase them, including performance metrics.

## Project Structure

```
├── 2025/              # Solutions for 2025
│   └── src/
│       ├── day01/
│       └── ...
├── 2024/              # Solutions for 2024
│   └── ...
├── web/               # Next.js website
└── README.md
```

## Years

- **[2025](./2025/)** - Current year
- **[2024](./2024/)**

### Viewing Performance

Performance metrics are displayed on the website (for 2025 and later):
- **Year overview**: Shows total runtime across all benchmarked days
- **Day details**: Detailed breakdown of Part 1 and Part 2 performance with min/median/mean/max statistics

## Website

The `web/` folder contains a Next.js website that displays all solutions with syntax highlighting and performance metrics.

```bash
cd web
bun install
bun dev
```

Visit `http://localhost:3000` to view the solutions.

## Running Solutions

See the README in each year's folder for instructions on running solutions.
