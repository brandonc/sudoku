import { readFileSync } from "node:fs";
import { load, solve, print } from "./puzzle.js";

function readInput(path: string | undefined): string {
  if (path) {
    return readFileSync(path, "utf-8");
  }
  return readFileSync(0, "utf-8");
}

const path = process.argv[2];
const puzzle = load(readInput(path).trim());
const [solved, result] = solve(puzzle);

if (solved && result) {
  console.log(print(result));
} else {
  console.error("no solution found");
  process.exit(1);
}
