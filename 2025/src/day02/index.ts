import { readComma } from "../utils/input.js";
import { runDay } from "../utils/runner.js";

export const input = readComma(2);

export function part1(values: string[]): number {
  let sum = 0;
  values.forEach((value) => {
    let [start, end] = value.split("-").map(Number);
    for (let num = start; num <= end; num++) {
      let string = num.toString();
      let first = string.substring(0, string.length / 2);
      let second = string.substring(string.length / 2);
      if (first == second) {
        sum += num;
      }
    }
  });
  return sum;
}

export function part2(values: string[]): number {
  let sum = 0;
  values.forEach((value) => {
    let [start, end] = value.split("-").map(Number);
    for (let num = start; num <= end; num++) {
      let string = num.toString();
      for (let k = 1; k <= string.length / 2; k++) {
        if (string.length % k !== 0) continue;
        let pattern = string.substring(0, k);
        let repeated = pattern.repeat(string.length / k);
        if (repeated === string) {
          sum += num;
          break;
        }
      }
    }
  });
  return sum;
}

export const solution = runDay({ day: 2, input, part1, part2 });
