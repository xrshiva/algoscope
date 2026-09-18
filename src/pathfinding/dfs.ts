import type { Coord, PathEvent, PathfindingAlgorithm } from './types';
import { buildPathEvents, createGrid, key, neighborsOf } from './gridUtils';

// Same shape as BFS but with a LIFO stack, so it dives down one branch
// before backtracking — it finds *a* path, not necessarily the shortest.
export const dfs: PathfindingAlgorithm = (grid, start, end) => {
  const events: PathEvent[] = [];
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const visited = createGrid(rows, cols, false);
  const parent = new Map<string, Coord>();
  const stack: Coord[] = [start];
  visited[start.row][start.col] = true;

  while (stack.length > 0) {
    const current = stack.pop()!;
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
      stack.push(neighbor);
    }
  }

  return events;
};
