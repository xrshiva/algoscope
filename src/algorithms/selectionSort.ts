import type { AlgoEvent, SortAlgorithm } from './types';

// For each position from the left, find the minimum of the remaining
// unsorted suffix and swap it into place. Once placed, that index never
// changes again, so it's marked sorted immediately.
export const selectionSort: SortAlgorithm = (input) => {
  const events: AlgoEvent[] = [];
  const arr = input.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      events.push({ type: 'compare', i: minIndex, j });
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      events.push({ type: 'swap', i, j: minIndex });
    }

    events.push({ type: 'markSorted', index: i });
  }

  if (n > 0) {
    events.push({ type: 'markSorted', index: n - 1 });
  }

  return events;
};
