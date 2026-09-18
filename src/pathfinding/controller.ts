import { astar } from './astar';
import { bfs } from './bfs';
import { COLS, ROWS } from './constants';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { GridRenderer } from './GridRenderer';
import { PathPlayer } from './PathPlayer';
import type { Coord, Grid, PathfindingAlgorithm } from './types';

const ALGORITHMS: Record<string, PathfindingAlgorithm> = { bfs, dfs, dijkstra, astar };

type PaintMode = 'wall' | 'start' | 'end';

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
}

export function initPathfinding(): void {
  const canvas = requireElement<HTMLCanvasElement>('#path-canvas');
  const renderer = new GridRenderer(canvas);
  const player = new PathPlayer();

  const grid: Grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => false));
  let start: Coord = { row: Math.floor(ROWS / 2), col: 2 };
  let end: Coord = { row: Math.floor(ROWS / 2), col: COLS - 3 };
  let mode: PaintMode = 'wall';
  let painting = false;

  const algorithmSelect = requireElement<HTMLSelectElement>('#path-algorithm');
  const playPauseButton = requireElement<HTMLButtonElement>('#path-play-pause');
  const stepButton = requireElement<HTMLButtonElement>('#path-step');
  const resetButton = requireElement<HTMLButtonElement>('#path-reset');
  const speedSlider = requireElement<HTMLInputElement>('#path-speed');
  const findPathButton = requireElement<HTMLButtonElement>('#find-path');
  const clearWallsButton = requireElement<HTMLButtonElement>('#clear-walls');
  const modeButtons: Record<PaintMode, HTMLButtonElement> = {
    wall: requireElement('#mode-wall'),
    start: requireElement('#mode-start'),
    end: requireElement('#mode-end'),
  };

  function setMode(newMode: PaintMode): void {
    mode = newMode;
    for (const [key, button] of Object.entries(modeButtons)) {
      button.classList.toggle('active', key === newMode);
    }
  }

  function paintAt(row: number, col: number): void {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;

    if (mode === 'wall') {
      if ((row === start.row && col === start.col) || (row === end.row && col === end.col)) return;
      grid[row][col] = true;
    } else if (mode === 'start') {
      if (row === end.row && col === end.col) return;
      grid[row][col] = false;
      start = { row, col };
    } else {
      if (row === start.row && col === start.col) return;
      grid[row][col] = false;
      end = { row, col };
    }

    player.load([]);
  }

  function cellFromEvent(event: MouseEvent): Coord {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
      row: Math.floor((y / rect.height) * ROWS),
      col: Math.floor((x / rect.width) * COLS),
    };
  }

  canvas.addEventListener('mousedown', (event) => {
    painting = true;
    const { row, col } = cellFromEvent(event);
    paintAt(row, col);
  });

  canvas.addEventListener('mousemove', (event) => {
    if (!painting) return;
    const { row, col } = cellFromEvent(event);
    paintAt(row, col);
  });

  window.addEventListener('mouseup', () => {
    painting = false;
  });

  for (const [modeKey, button] of Object.entries(modeButtons)) {
    button.addEventListener('click', () => setMode(modeKey as PaintMode));
  }

  clearWallsButton.addEventListener('click', () => {
    for (const row of grid) row.fill(false);
    player.load([]);
  });

  function findPath(): void {
    const algorithm = ALGORITHMS[algorithmSelect.value] ?? bfs;
    player.load(algorithm(grid, start, end));
  }

  findPathButton.addEventListener('click', findPath);
  algorithmSelect.addEventListener('change', findPath);

  playPauseButton.addEventListener('click', () => {
    if (playPauseButton.textContent === 'Pause') {
      player.pause();
    } else {
      player.play();
    }
  });

  stepButton.addEventListener('click', () => player.stepForward());
  resetButton.addEventListener('click', () => player.reset());
  speedSlider.addEventListener('input', () => player.setSpeed(Number(speedSlider.value)));

  player.onChange((state) => renderer.draw(grid, start, end, state));
  player.onChange((state) => {
    playPauseButton.textContent = state.isPlaying ? 'Pause' : 'Play';
    playPauseButton.disabled = state.isFinished && !state.isPlaying;
    stepButton.disabled = state.isFinished;
  });

  setMode('wall');
  player.load([]);
}
