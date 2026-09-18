import type { AlgoEvent, SortAlgorithm } from './types';

// Lomuto partition, pivot = last element. After each partition, the pivot
// sits at its final sorted index and is never touched again, so it's
// marked sorted immediately.
export const quickSort: SortAlgorithm = (input) => {
  const events: AlgoEvent[] = [];
  const arr = input.slice();

  function partition(lo: number, hi: number): number {
    const pivot = arr[hi];
    let store = lo;

    for (let i = lo; i < hi; i++) {
      events.push({ type: 'compare', i, j: hi });
      if (arr[i] < pivot) {
        if (i !== store) {
          [arr[i], arr[store]] = [arr[store], arr[i]];
          events.push({ type: 'swap', i, j: store });
        }
        store++;
      }
    }

    if (store !== hi) {
      [arr[store], arr[hi]] = [arr[hi], arr[store]];
      events.push({ type: 'swap', i: store, j: hi });
    }

    return store;
  }

  function sort(lo: number, hi: number): void {
    if (lo > hi) return;
    if (lo === hi) {
      events.push({ type: 'markSorted', index: lo });
      return;
    }

    const pivotIndex = partition(lo, hi);
    events.push({ type: 'markSorted', index: pivotIndex });
    sort(lo, pivotIndex - 1);
    sort(pivotIndex + 1, hi);
  }

  if (arr.length > 0) sort(0, arr.length - 1);

  return events;
};
