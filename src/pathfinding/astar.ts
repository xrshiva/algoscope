import type { Coord, PathEvent, PathfindingAlgorithm } from './types';
import { buildPathEvents, createGrid, key, neighborsOf } from './gridUtils';

function manhattan(a: Coord, b: Coord): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Like Dijkstra, but the priority is distance-so-far plus a Manhattan-
// distance estimate of what's left, so it expands cells pointed toward
// `end` before others of equal known distance. Admissible on a 4-directional
// unweighted grid, so the path found is still guaranteed shortest.
export const astar: PathfindingAlgorithm = (grid, start, end) => {
  const events: PathEvent[] = [];
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const dist = createGrid(rows, cols, Infinity);
  const visited = createGrid(rows, cols, false);
  const parent = new Map<string, Coord>();
  dist[start.row][start.col] = 0;

  const open: Coord[] = [start];

  while (open.length > 0) {
    let bestIndex = 0;
    let bestScore = dist[open[0].row][open[0].col] + manhattan(open[0], end);
    for (let i = 1; i < open.length; i++) {
      const score = dist[open[i].row][open[i].col] + manhattan(open[i], end);
      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    const current = open[bestIndex];
    open.splice(bestIndex, 1);
    if (visited[current.row][current.col]) continue;

    visited[current.row][current.col] = true;
    events.push({ type: 'visit', row: current.row, col: current.col });

    if (current.row === end.row && current.col === end.col) {
      events.push(...buildPathEvents(parent, end));
      return events;
    }

    for (const neighbor of neighborsOf(current, rows, cols)) {
      if (grid[neighbor.row][neighbor.col] || visited[neighbor.row][neighbor.col]) continue;

      const newDist = dist[current.row][current.col] + 1;
      if (newDist < dist[neighbor.row][neighbor.col]) {
        dist[neighbor.row][neighbor.col] = newDist;
        parent.set(key(neighbor), current);
        events.push({ type: 'frontier', row: neighbor.row, col: neighbor.col });
        open.push(neighbor);
      }
    }
  }

  return events;
};
