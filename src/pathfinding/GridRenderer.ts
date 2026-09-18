import { CELL_SIZE } from './constants';
import type { Coord, Grid } from './types';
import type { PathPlayerState } from './PathPlayer';

const COLOR_EMPTY = '#0f172a';
const COLOR_WALL = '#1e293b';
const COLOR_START = '#22c55e';
const COLOR_END = '#ef4444';
const COLOR_FRONTIER = '#38bdf8';
const COLOR_VISITED = '#3b82f6';
const COLOR_PATH = '#facc15';
const COLOR_GRID_LINE = 'rgba(255, 255, 255, 0.08)';

// Draws the grid as a lattice of cells. Takes a state snapshot and paints
// it — has no timers, no algorithm knowledge, no mutation of its input.
export class GridRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
  }

  draw(grid: Grid, start: Coord, end: Coord, state: PathPlayerState): void {
    const { ctx, canvas } = this;
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        ctx.fillStyle = colorFor(grid, row, col, start, end, state);
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = COLOR_GRID_LINE;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function colorFor(grid: Grid, row: number, col: number, start: Coord, end: Coord, state: PathPlayerState): string {
  if (row === start.row && col === start.col) return COLOR_START;
  if (row === end.row && col === end.col) return COLOR_END;
  if (grid[row][col]) return COLOR_WALL;

  const cellKey = `${row},${col}`;
  if (state.path.has(cellKey)) return COLOR_PATH;
  if (state.visited.has(cellKey)) return COLOR_VISITED;
  if (state.frontier.has(cellKey)) return COLOR_FRONTIER;
  return COLOR_EMPTY;
}
