import { expect, test } from "vitest";
import { print, load, solve } from "./puzzle.js";
import { readFileSync } from "node:fs";

const EASY = readFileSync("puzzles/easy/1.txt", "utf-8");
const MEDIUM = readFileSync("puzzles/medium/1.txt", "utf-8");
const HARD = readFileSync("puzzles/hard/1.txt", "utf-8");

test("can load puzzle as a single string", () => {
  load(
    "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  );
});

test("can load puzzle as a human text", () => {
  load(EASY);
});

test("not enough puzzle input", () => {
  expect(() => load("5300700006001950000980000608000600")).toThrow(
    "not enough",
  );
});

test("not enough puzzle input as human test", () => {
  expect(() =>
    load(`
5 3 0 | 0 7 0 | 0 0 0
6 0 0 | 1 9 5 | 0 0 0
0 9 8 | 0 0 0 | 0 6 0
------+-------+------
8 0 0 |   6   | 0 0 3
4 0 0 | 8   3 | 0 0 1
7 0 0 |   2   | 0 0 6
------+-------+------
0 6 0 | 0 0 0 | 2 8 0
0 0 0 | 4 1 9 | 0 0 5
0 0 0 | 0 8 0 | 0 7`),
  ).toThrow("not enough");
});

test("too much puzzle input", () => {
  expect(() =>
    load(
      "53007000060019500009800006080006000340080300170002000606000028000041900500008005300700006001950000980000608000600034008030017000200060600002800004190050000800",
    ),
  ).toThrow("too much");
});

test("dots as empty", () => {
  load(`5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
------+------+------
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9`);
});

test("can solve an easy puzzle", () => {
  const p = load(
    `
. . 1 | . 3 9 | 7 2 .
3 9 . | 2 . . | 6 4 .
4 . 7 | 6 . 5 | 1 . .
------+------+------
. 3 . | . 1 . | . 5 6
5 4 2 | 3 . . | 8 . .
1 . . | . 5 2 | 4 . 9
------+------+------
. . 4 | . 6 3 | 5 8 2
6 8 . | . 2 . | . 1 4
. 5 9 | 1 . 8 | . . 7`.trim(),
  );

  const [solved, _] = solve(p);
  expect(solved).toEqual(true);
});

test("can solve a medium puzzle", () => {
  const p = load(
    `
. 8 . | 4 . . | . 9 .
9 . 3 | 7 . . | . 6 .
. 1 . | . 5 . | . . 8
------+-------+------
5 3 . | . . 8 | 2 . 7
8 . . | . . . | 9 . .
. . . | . . 4 | 5 . 3
------+-------+------
. . 1 | . 9 . | . 3 4
. . . | . 4 1 | . . .
4 2 8 | . 3 . | . . .
    `.trim(),
  );

  const [solved, _] = solve(p);
  expect(solved).toEqual(true);
});

test("can solve a very hard puzzle", () => {
  const p = load(
    `
. . . | . . . | . 7 9
. 9 . | 3 5 . | . . .
8 . . | 1 . . | 4 . .
------+-------+------
. . . | 5 3 . | . 2 .
3 5 . | 8 . . | . . 4
9 . 6 | . . . | . . .
------+-------+------
. . 7 | . 4 . | . . 2
. . . | . . . | . 6 .
. . . | . . 8 | . . 1
    `.trim(),
  );

  console.log(print(p));
  console.log();
  const [result, solved] = solve(p);
  if (solved) {
    console.log(print(solved));
  }

  expect(result).toEqual(true);
});
