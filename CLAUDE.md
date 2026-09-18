# Algoscope

A web-based algorithm visualizer. Users watch algorithms run step by step instead of just reading code.

## Stack

- TypeScript, strict mode
- Vite (base path `/algoscope/`, for GitHub Pages)
- Canvas 2D for rendering — no charting or animation libraries
- Vitest for tests
- No UI framework (no React/Vue/etc.)
- Deploys as a static site to GitHub Pages

## Core architecture

Algorithms don't return results — they emit a chronological list of typed `AlgoEvent`s describing every step. A separate player/renderer replays those events as animation.

**The rule: algorithm code only emits events. It never touches rendering, timing, or the DOM.** An algorithm is a pure function `(input: number[]) => AlgoEvent[]` — same input always produces the same event list, testable with no DOM or timers involved.

## Module boundaries

- `src/algorithms/` — pure functions producing `AlgoEvent[]`. No imports from `render/` or `player/`, no DOM references. This is the only place `SortAlgorithm` implementations live.
- `src/player/` — `Player` steps through a fixed event list on a timer (play/pause/step/reset/speed). Owns a working copy of the array, reconstructed by replaying `swap` events — the algorithm that produced the events never sees this state. Knows nothing about how to draw.
- `src/render/` — `CanvasRenderer` takes a state snapshot and paints bars to canvas. No timers, no algorithm knowledge, never mutates its input.
- `src/ui/` — wires DOM controls (buttons, slider) to `Player`'s public methods. No algorithm or rendering knowledge.
- `src/main.ts` — the only file that imports across all of the above; wires everything together.

When adding a new algorithm, add it under `src/algorithms/` as a `SortAlgorithm` and nothing else needs to change — `Player` and `CanvasRenderer` are algorithm-agnostic.

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck + production build
- `npm run test` — run Vitest suite
- `npm run typecheck` — `tsc --noEmit`

## Environment note

System default Node is v16 (too old for Vite 7). Use `nvm use` (reads `.nvmrc`, pinned to v23.8.0) before running any npm scripts.
