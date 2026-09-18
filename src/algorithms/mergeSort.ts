import type { AlgoEvent, SortAlgorithm } from './types';

// Classic top-down merge sort. Merging writes values back from temporary
// left/right buffers rather than swapping in place, so it emits
// `overwrite` events instead of `swap`. No index is final until the
// whole array has been merged, so sorted marks are emitted at the end.
export const mergeSort: SortAlgorithm = (input) => {
  const events: AlgoEvent[] = [];
  const arr = input.slice();
  const n = arr.length;

  function merge(lo: number, mid: number, hi: number): void {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;

    while (i < left.length && j < right.length) {
      events.push({ type: 'compare', i: lo + i, j: mid + 1 + j });
      const value = left[i] <= right[j] ? left[i++] : right[j++];
      arr[k] = value;
      events.push({ type: 'overwrite', index: k, value });
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      events.push({ type: 'overwrite', index: k, value: left[i] });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      events.push({ type: 'overwrite', index: k, value: right[j] });
      j++;
      k++;
    }
  }

  function sort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  if (n > 0) sort(0, n - 1);
  for (let k = 0; k < n; k++) {
    events.push({ type: 'markSorted', index: k });
  }

  return events;
};
