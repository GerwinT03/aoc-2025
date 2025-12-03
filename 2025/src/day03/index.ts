import { readLines } from "../utils/input.js";
import { runDay } from "../utils/runner.js";

export const input = readLines(3);

export function part1(lines: string[]): number {
  let sum = 0;
  lines.forEach( line => {
    const chars = line.trimEnd().split("");
    let highest = 0;
    let index = 0;
    for (let i = 0; i < chars.length - 1; i++) {
      const value = parseInt(chars[i]);
      if (value > highest) {
        highest = value;
        index = i;
      }
    }
    
    let second = 0;
    for (let i = index + 1; i < chars.length; i++) {
      const value = parseInt(chars[i]);
      if (value > second) {
        second = value;
      }
    }
    
    sum += highest * 10 + second;
  })
  return sum;
}

export function part2(lines: string[]): number {
  let sum = 0;
  lines.forEach( line => {
    const chars = line.trimEnd().split("");
    const result = [];
    let searchStart = 0;
    const keepCount = 12;
    
    for (let i = 0; i < keepCount; i++) {
      const maxSearchIndex = chars.length - (keepCount - i);
      const { value, index } = getHighestInRange(chars, searchStart, maxSearchIndex);
      result.push(value);
      searchStart = index + 1;
    }
    
    sum += parseInt(result.join(''));
  })
  return sum;

  function getHighestInRange(digits: string[], startIndex: number, endIndex: number): { value: number, index: number } {
    let highest = -1;
    let index = -1;
    
    for (let i = startIndex; i <= endIndex; i++) {
      const value = parseInt(digits[i]);
      if (value > highest) {
        highest = value;
        index = i;
      }
    }
    
    return { value: highest, index };
  }
}

export const solution = runDay({ day: 3, input, part1, part2 });
