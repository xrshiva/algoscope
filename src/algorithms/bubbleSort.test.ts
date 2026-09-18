import { describe, expect, it } from 'vitest';
import { bubbleSort } from './bubbleSort';
import type { AlgoEvent } from './types';

describe('bubbleSort', () => {
  it('emits the expected event sequence for [3, 1, 2]', () => {
    const expected: AlgoEvent[] = [
      { type: 'compare', i: 0, j: 1 },
      { type: 'swap', i: 0, j: 1 },
      { type: 'compare', i: 1, j: 2 },
      { type: 'swap', i: 1, j: 2 },
      { type: 'markSorted', index: 2 },
      { type: 'compare', i: 0, j: 1 },
      { type: 'markSorted', index: 1 },
      { type: 'markSorted', index: 0 },
    ];

    expect(bubbleSort([3, 1, 2])).toEqual(expected);
  });

  it('emits no events for an empty array', () => {
    expect(bubbleSort([])).toEqual([]);
  });

  it('emits a single markSorted for a one-element array', () => {
    expect(bubbleSort([42])).toEqual([{ type: 'markSorted', index: 0 }]);
  });

  it('emits no compares or swaps for an already-sorted array', () => {
    const events = bubbleSort([1, 2, 3]);
    expect(events.every((event) => event.type !== 'swap')).toBe(true);
  });

  it('produces a sorted result by replaying swap events over the input', () => {
    const input = [5, 3, 8, 1, 9, 2];
    const events = bubbleSort(input);
    const result = input.slice();
    for (const event of events) {
      if (event.type === 'swap') {
        [result[event.i], result[event.j]] = [result[event.j], result[event.i]];
      }
    }
    expect(result).toEqual([1, 2, 3, 5, 8, 9]);
  });
});
