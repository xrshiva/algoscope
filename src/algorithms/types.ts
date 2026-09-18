export type AlgoEvent =
  | { type: 'compare'; i: number; j: number }
  | { type: 'swap'; i: number; j: number }
  | { type: 'overwrite'; index: number; value: number }
  | { type: 'markSorted'; index: number };

export type SortAlgorithm = (input: number[]) => AlgoEvent[];
