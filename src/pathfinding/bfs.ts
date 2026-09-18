import type { Coord, PathEvent, PathfindingAlgorithm } from './types';
import { buildPathEvents, createGrid, key, neighborsOf } from './gridUtils';

// Explores the grid one ring at a time via a FIFO queue, guaranteeing the
// first time `end` is reached the path found is shortest (unweighted).
export const bfs: PathfindingAlgorithm = (grid, start, end) => {
  const events: PathEvent[] = [];
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const visited = createGrid(rows, cols, false);
  const parent = new Map<string, Coord>();
  const queue: Coord[] = [start];
  visited[start.row][start.col] = true;

  while (queue.length > 0) {
    const current = queue.shift()!;
    events.push({ type: 'visit', row: current.row, col: current.col });

    if (current.row === end.row && current.col === end.col) {
      events.push(...buildPathEvents(parent, end));
      return events;
    }

    for (const neighbor of neighborsOf(current, rows, cols)) {
      if (grid[neighbor.row][neighbor.col]) continue;
      if (visited[neighbor.row][neighbor.col]) continue;

      visited[neighbor.row][neighbor.col] = true;
      parent.set(key(neighbor), current);
      events.push({ type: 'frontier', row: neighbor.row, col: neighbor.col });
      queue.push(neighbor);
    }
  }

  return events;
};
