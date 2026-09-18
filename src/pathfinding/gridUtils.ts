import type { Coord, PathEvent } from './types';

export function createGrid<T>(rows: number, cols: number, fill: T): T[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function key(coord: Coord): string {
  return `${coord.row},${coord.col}`;
}

export function neighborsOf(coord: Coord, rows: number, cols: number): Coord[] {
  const candidates: Coord[] = [
    { row: coord.row - 1, col: coord.col },
    { row: coord.row + 1, col: coord.col },
    { row: coord.row, col: coord.col - 1 },
    { row: coord.row, col: coord.col + 1 },
  ];
  return candidates.filter((c) => c.row >= 0 && c.row < rows && c.col >= 0 && c.col < cols);
}

// Walks the parent chain from end back to start and turns it into an
// ordered list of `path` events, start first. Empty if end was never reached.
export function buildPathEvents(parent: Map<string, Coord>, end: Coord): PathEvent[] {
  const path: Coord[] = [end];
  let currentKey = key(end);

  while (parent.has(currentKey)) {
    const prev = parent.get(currentKey)!;
    path.push(prev);
    currentKey = key(prev);
  }

  path.reverse();
  return path.map((coord) => ({ type: 'path' as const, row: coord.row, col: coord.col }));
}
