import { describe, expect, it } from 'vitest';
import { dfs } from './dfs';
import type { Grid, PathEvent } from './types';

// A 3x3 grid with walls at (0,1) and (1,1) leaves exactly one route from
// corner to corner, forcing every algorithm to visit cells in this same
// order regardless of traversal strategy.
const CORRIDOR: Grid = [
  [false, true, false],
  [false, true, false],
  [false, false, false],
];

describe('dfs', () => {
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

    expect(dfs(CORRIDOR, { row: 0, col: 0 }, { row: 0, col: 2 })).toEqual(expected);
  });

  it('emits just a single path event when start equals end', () => {
    const start = { row: 0, col: 0 };
    expect(dfs(CORRIDOR, start, start)).toEqual([
      { type: 'visit', row: 0, col: 0 },
      { type: 'path', row: 0, col: 0 },
    ]);
  });

  it('emits no path events when the end is unreachable', () => {
    const walled: Grid = [
      [false, true],
      [false, true],
    ];
    const events = dfs(walled, { row: 0, col: 0 }, { row: 0, col: 1 });
    expect(events.some((event) => event.type === 'path')).toBe(false);
  });

  it('finds a valid path on an open grid, not necessarily shortest', () => {
    const open: Grid = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const events = dfs(open, { row: 0, col: 0 }, { row: 2, col: 2 });
    const path = events.filter((event) => event.type === 'path') as Array<{ row: number; col: number }>;

    expect(path[0]).toMatchObject({ row: 0, col: 0 });
    expect(path[path.length - 1]).toMatchObject({ row: 2, col: 2 });
    for (let i = 1; i < path.length; i++) {
      const stepDistance = Math.abs(path[i].row - path[i - 1].row) + Math.abs(path[i].col - path[i - 1].col);
      expect(stepDistance).toBe(1);
    }
  });
});
