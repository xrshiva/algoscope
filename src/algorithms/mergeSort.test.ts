import { describe, expect, it } from 'vitest';
import { mergeSort } from './mergeSort';
import type { AlgoEvent } from './types';

describe('mergeSort', () => {
  it('emits the expected event sequence for [3, 1, 2]', () => {
    const expected: AlgoEvent[] = [
      { type: 'compare', i: 0, j: 1 },
      { type: 'overwrite', index: 0, value: 1 },
      { type: 'overwrite', index: 1, value: 3 },
      { type: 'compare', i: 0, j: 2 },
      { type: 'overwrite', index: 0, value: 1 },
      { type: 'compare', i: 1, j: 2 },
      { type: 'overwrite', index: 1, value: 2 },
      { type: 'overwrite', index: 2, value: 3 },
      { type: 'markSorted', index: 0 },
      { type: 'markSorted', index: 1 },
      { type: 'markSorted', index: 2 },
    ];

    expect(mergeSort([3, 1, 2])).toEqual(expected);
  });

  it('emits no events for an empty array', () => {
    expect(mergeSort([])).toEqual([]);
  });

  it('emits a single markSorted for a one-element array', () => {
    expect(mergeSort([42])).toEqual([{ type: 'markSorted', index: 0 }]);
  });

  it('produces a sorted result by replaying swap and overwrite events over the input', () => {
    const input = [5, 3, 8, 1, 9, 2];
    const events = mergeSort(input);
    const result = input.slice();
    for (const event of events) {
      if (event.type === 'swap') {
        [result[event.i], result[event.j]] = [result[event.j], result[event.i]];
      } else if (event.type === 'overwrite') {
        result[event.index] = event.value;
      }
    }
    expect(result).toEqual([1, 2, 3, 5, 8, 9]);
  });
});
