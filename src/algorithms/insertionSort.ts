import type { AlgoEvent, SortAlgorithm } from './types';

// Builds up a sorted prefix by repeatedly swapping each new element left
// past anything bigger than it. Unlike bubble/selection sort, no index
// holds its final value until the whole array has been processed, so
// everything is marked sorted together at the end.
export const insertionSort: SortAlgorithm = (input) => {
  const events: AlgoEvent[] = [];
  const arr = input.slice();
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      events.push({ type: 'compare', i: j - 1, j });
      if (arr[j - 1] <= arr[j]) break;

      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      events.push({ type: 'swap', i: j - 1, j });
      j--;
    }
  }

  for (let k = 0; k < n; k++) {
    events.push({ type: 'markSorted', index: k });
  }

  return events;
};
