import { describe, expect, it } from 'vitest';
import { astar } from './astar';
import type { Grid, PathEvent } from './types';

// A 3x3 grid with walls at (0,1) and (1,1) leaves exactly one route from
// corner to corner, forcing every algorithm to visit cells in this same
// order regardless of traversal strategy.
const CORRIDOR: Grid = [
  [false, true, false],
  [false, true, false],
  [false, false, false],
];

describe('astar', () => {
  it('emits the expected event sequence through a forced corridor', () => {
    const expected: PathEvent[] = [
      { type: 'visit', row: 0, col: 0 },
      { type: 'frontier', row: 1, col: 0 },
      { type: 'visit', row: 1, col: 0 },
      { type: 'frontier', row: 2, col: 0 },
      { type: 'visit', row: 2, col: 0 },
      { type: 'frontier', row: 2, col: 1 },
      { type: 'visit', row: 2, col: 1 },
      { type: 'frontier', row: 2, col: 2 },
      { type: 'visit', row: 2, col: 2 },
      { type: 'frontier', row: 1, col: 2 },
      { type: 'visit', row: 1, col: 2 },
      { type: 'frontier', row: 0, col: 2 },
      { type: 'visit', row: 0, col: 2 },
      { type: 'path', row: 0, col: 0 },
      { type: 'path', row: 1, col: 0 },
      { type: 'path', row: 2, col: 0 },
      { type: 'path', row: 2, col: 1 },
      { type: 'path', row: 2, col: 2 },
      { type: 'path', row: 1, col: 2 },
      { type: 'path', row: 0, col: 2 },
    ];

    expect(astar(CORRIDOR, { row: 0, col: 0 }, { row: 0, col: 2 })).toEqual(expected);
  });

  it('emits just a single path event when start equals end', () => {
    const start = { row: 0, col: 0 };
    expect(astar(CORRIDOR, start, start)).toEqual([
      { type: 'visit', row: 0, col: 0 },
      { type: 'path', row: 0, col: 0 },
    ]);
  });

  it('emits no path events when the end is unreachable', () => {
    const walled: Grid = [
      [false, true],
      [false, true],
    ];
    const events = astar(walled, { row: 0, col: 0 }, { row: 0, col: 1 });
    expect(events.some((event) => event.type === 'path')).toBe(false);
  });

  it('finds a valid, shortest path on an open grid', () => {
    const open: Grid = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const events = astar(open, { row: 0, col: 0 }, { row: 2, col: 2 });
    const path = events.filter((event) => event.type === 'path');
    expect(path).toHaveLength(5); // Manhattan distance 4 + the start cell
    expect(path[0]).toMatchObject({ row: 0, col: 0 });
    expect(path[path.length - 1]).toMatchObject({ row: 2, col: 2 });
  });
});
