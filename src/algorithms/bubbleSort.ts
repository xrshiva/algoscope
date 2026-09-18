import type { AlgoEvent, SortAlgorithm } from './types';

// Optimized bubble sort: stops early once a pass makes no swaps, and marks
// the whole remaining prefix sorted at once instead of one index at a time.
export const bubbleSort: SortAlgorithm = (input) => {
  const events: AlgoEvent[] = [];
  const arr = input.slice();
  let end = arr.length - 1;

  while (true) {
    let swapped = false;

    for (let i = 0; i < end; i++) {
      events.push({ type: 'compare', i, j: i + 1 });
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        events.push({ type: 'swap', i, j: i + 1 });
        swapped = true;
      }
    }

    if (!swapped) {
      for (let k = end; k >= 0; k--) {
        events.push({ type: 'markSorted', index: k });
      }
      break;
    }

    events.push({ type: 'markSorted', index: end });
    end--;
  }

  return events;
};
