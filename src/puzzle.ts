type Row<T> = [T, T, T, T, T, T, T, T, T];
type Grid<T> = [
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
];
type Idx = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Puzzle = {
  // Puzzle is represented as a two-dimensional array: Each outer element is an array representing
  // the _row_ of numbers.
  grid: Grid<number>;
  candidates: Grid<Set<number>>;
};

const INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const satisfies readonly Idx[];

const BLOCK_STARTS: Record<Idx, Idx> = {
  0: 0,
  1: 0,
  2: 0,
  3: 3,
  4: 3,
  5: 3,
  6: 6,
  7: 6,
  8: 6,
} as const;

const FULL_SET = new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

function buildRow<T>(factory: () => T): Row<T> {
  return INDICES.map(factory) as Row<T>;
}

function buildGrid<T>(factory: () => T): Grid<T> {
  return INDICES.map((_) => buildRow(factory)) as Grid<T>;
}

export function load(puzzle: String): Puzzle {
  let row: number = 0;
  let col: number = 0;

  const p: Puzzle = {
    grid: buildGrid(() => 0),
    candidates: buildGrid(() => structuredClone(FULL_SET)),
  };

  for (const c of puzzle.trim()) {
    // Detect '.' as empty input
    if (c === ".") {
      // Do nothing, cell already initialized 0
    } else if (/^\d$/.test(c)) {
      if (!(row in INDICES)) {
        throw new Error("too much puzzle input");
      }
      // This cell is a number so parse it and assign to cell
      setCell(p, row as Idx, col as Idx, parseInt(c));
    } else {
      // Ignore this char
      continue;
    }

    col += 1;
    if (col > 8) {
      row += 1;
      col = 0;
    }
  }

  if (row < 8 || (row === 8 && col > 0)) {
    throw new Error("not enough puzzle input");
  }

  return p;
}

export function solve(p: Puzzle): [Boolean, Puzzle | null] {
  return solveBruteForce(p);
}

function setCell(p: Puzzle, row: Idx, col: Idx, n: number) {
  const currentRow = p.grid[row];
  currentRow[col] = n;

  for (const r of INDICES) {
    p.candidates[r][col].delete(n);
  }
  for (const c of INDICES) {
    p.candidates[row][c].delete(n);
  }

  row = BLOCK_STARTS[row];
  col = BLOCK_STARTS[col];

  for (let r = row; r < row + 3; r++) {
    for (let c = col; c < col + 3; c++) {
      p.candidates[r][c].delete(n);
    }
  }
}

function chooseLowestEntropy(p: Puzzle): [Idx, Idx] {
  let minRow: Idx = 0;
  let minCol: Idx = 0;
  let min = 10;
  for (const row of INDICES) {
    for (const col of INDICES) {
      if (p.grid[row][col] !== 0) {
        continue;
      }

      if (p.candidates[row][col].size < min) {
        minRow = row;
        minCol = col;
        min = p.candidates[row][col].size;
      }
    }
  }

  return [minRow, minCol];
}

function solveBruteForce(p: Puzzle): [Boolean, Puzzle | null] {
  // Step through each unset grid, choose the cell with the smallest entropy,
  // choose a value and narrow down the remaining squares.

  if (isSolved(p)) {
    return [true, p];
  }

  const [row, col] = chooseLowestEntropy(p);
  const candidates = p.candidates[row][col];

  if (candidates.size === 0) {
    // Indicates an impossible grid
    return [false, null];
  }

  for (const candidate of candidates.values()) {
    const q = structuredClone(p);
    setCell(q, row, col, candidate);

    const [solved, result] = solveBruteForce(q);
    if (solved) {
      return [true, result];
    }
  }

  return [false, null];
}

export function print(p: Puzzle): String {
  let result = "";
  for (const row of INDICES) {
    for (const col of INDICES) {
      const val = p.grid[row][col];
      if (val === 0) {
        result += " ";
      } else {
        result += `${val}`;
      }

      if (col === 8) {
        result += "\n";
      } else if (col === 2 || col === 5) {
        result += " | ";
      } else {
        result += " ";
      }
    }
    if (row === 2 || row === 5) {
      result += "------+-------+------\n";
    }
  }

  return result;
}

function isSolved(p: Puzzle): Boolean {
  // Each row
  for (const row of INDICES) {
    if (candidatesInRow(p, row).size > 0) {
      return false;
    }
  }
  // Each col
  for (const col of INDICES) {
    if (candidatesInCol(p, col).size > 0) {
      return false;
    }
  }
  // Each block
  for (let rowB = 0 as Idx; rowB < 9; rowB += 3) {
    for (let colB = 0 as Idx; colB < 9; colB += 3) {
      if (candidatesInBlock(p, rowB, colB).size > 0) {
        return false;
      }
    }
  }

  return true;
}

function candidatesInBlock(p: Puzzle, row: Idx, col: Idx): Set<number> {
  const result = new Set<number>();

  row = BLOCK_STARTS[row];
  col = BLOCK_STARTS[col];

  for (let r = row; r < row + 3; r++) {
    for (let c = col; c < col + 3; c++) {
      let x = p.grid[r][c];
      if (x > 0) {
        result.add(x);
      }
    }
  }

  return FULL_SET.difference(result);
}

function candidatesInCol(p: Puzzle, col: Idx): Set<number> {
  const result = new Set<number>();

  for (const r of INDICES) {
    let x = p.grid[r][col];
    if (x > 0) {
      result.add(x);
    }
  }

  return FULL_SET.difference(result);
}

function candidatesInRow(p: Puzzle, row: Idx): Set<number> {
  const result = new Set<number>();
  for (const c of INDICES) {
    let x = p.grid[row][c];
    if (x > 0) {
      result.add(x);
    }
  }

  return FULL_SET.difference(result);
}
