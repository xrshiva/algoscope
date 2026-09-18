export interface Coord {
  row: number;
  col: number;
}

// grid[row][col] === true means that cell is a wall.
export type Grid = boolean[][];

export type PathEvent =
  | { type: 'frontier'; row: number; col: number }
  | { type: 'visit'; row: number; col: number }
  | { type: 'path'; row: number; col: number };

export type PathfindingAlgorithm = (grid: Grid, start: Coord, end: Coord) => PathEvent[];
