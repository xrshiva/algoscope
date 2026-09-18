import { describe, expect, it } from 'vitest';
import { quickSort } from './quickSort';
import type { AlgoEvent } from './types';

describe('quickSort', () => {
  it('emits the expected event sequence for [3, 1, 2]', () => {
    const expected: AlgoEvent[] = [
      { type: 'compare', i: 0, j: 2 },
      { type: 'compare', i: 1, j: 2 },
      { type: 'swap', i: 1, j: 0 },
      { type: 'swap', i: 1, j: 2 },
      { type: 'markSorted', index: 1 },
      { type: 'markSorted', index: 0 },
      { type: 'markSorted', index: 2 },
    ];

    expect(quickSort([3, 1, 2])).toEqual(expected);
  });

  it('emits no events for an empty array', () => {
    expect(quickSort([])).toEqual([]);
  });

  it('emits a single markSorted for a one-element array', () => {
    expect(quickSort([42])).toEqual([{ type: 'markSorted', index: 0 }]);
  });

  it('produces a sorted result by replaying swap events over the input', () => {
    const input = [5, 3, 8, 1, 9, 2];
    const events = quickSort(input);
    const result = input.slice();
    for (const event of events) {
      if (event.type === 'swap') {
        [result[event.i], result[event.j]] = [result[event.j], result[event.i]];
      }
    }
    expect(result).toEqual([1, 2, 3, 5, 8, 9]);
  });
});
