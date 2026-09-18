import type { Coord, PathEvent, PathfindingAlgorithm } from './types';
import { buildPathEvents, createGrid, key, neighborsOf } from './gridUtils';

// Every step costs 1 on this grid, so Dijkstra settles cells in the same
// order BFS would — but it gets there by tracking real distances and
// always expanding the closest unsettled cell, the way it must once edge
// weights stop being uniform. Uses a linear scan for the minimum instead
// of a heap: the grid is small enough that O(V^2) is irrelevant, and a
// hand-rolled heap would only make this harder to read.
export const dijkstra: PathfindingAlgorithm = (grid, start, end) => {
  const events: PathEvent[] = [];
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const dist = createGrid(rows, cols, Infinity);
  const visited = createGrid(rows, cols, false);
  const parent = new Map<string, Coord>();
  dist[start.row][start.col] = 0;

  const unvisited: Coord[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c]) unvisited.push({ row: r, col: c });
    }
  }

  while (unvisited.length > 0) {
    let bestIndex = 0;
    for (let i = 1; i < unvisited.length; i++) {
      const candidate = unvisited[i];
      const best = unvisited[bestIndex];
      if (dist[candidate.row][candidate.col] < dist[best.row][best.col]) {
        bestIndex = i;
      }
    }

    const current = unvisited[bestIndex];
    unvisited.splice(bestIndex, 1);
    if (dist[current.row][current.col] === Infinity) break;

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
      }
    }
  }

  return events;
};
