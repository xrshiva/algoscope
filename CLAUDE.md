# Algoscope

A web-based algorithm visualizer. Users watch algorithms run step by step instead of just reading code. Two visualizers live on one page behind a tab switcher: **Sorting** and **Pathfinding**.

## Stack

- TypeScript, strict mode
- Vite (base path `/algoscope/`, for GitHub Pages)
- Canvas 2D for rendering — no charting or animation libraries
- Vitest for tests
- No UI framework (no React/Vue/etc.)
- Deploys as a static site to GitHub Pages

## Sorting visualizer

Algorithms don't return results — they emit a chronological list of typed `AlgoEvent`s describing every step. A separate player/renderer replays those events as animation.

**The rule: algorithm code only emits events. It never touches rendering, timing, or the DOM.** An algorithm is a pure function `(input: number[]) => AlgoEvent[]` — same input always produces the same event list, testable with no DOM or timers involved.

Event types: `compare` (highlight two indices), `swap` (exchange two indices in place), `overwrite` (write a value into an index — used by algorithms like merge sort that copy from a temp buffer rather than swap), `markSorted` (an index holds its final value and will never change again).

**`markSorted` must only be emitted when that's actually true.** Bubble/selection sort can mark an index sorted immediately, since the value there is provably final. Insertion/merge sort cannot know any index is final until the whole array is done, so they mark everything sorted in one sweep at the end rather than progressively. Get this wrong and the renderer shows green on a bar that later changes value.

**Algorithms implemented:** bubble, insertion, selection, quick (Lomuto partition), and merge sort — all in `src/algorithms/`, all behind the `SortAlgorithm` interface, selectable from the sorting view's dropdown.

**Module boundaries:**

- `src/algorithms/` — pure functions producing `AlgoEvent[]`. No imports from `render/` or `player/`, no DOM references. This is the only place `SortAlgorithm` implementations live.
- `src/player/` — `Player` steps through a fixed event list on a timer (play/pause/step/reset/speed). Owns a working copy of the array, reconstructed by replaying `swap`/`overwrite` events — the algorithm that produced the events never sees this state. Knows nothing about how to draw.
- `src/render/` — `CanvasRenderer` takes a state snapshot and paints bars to canvas. No timers, no algorithm knowledge, never mutates its input.
- `src/ui/` — wires DOM controls (buttons, slider, custom-array input) to `Player`'s public methods. No algorithm or rendering knowledge.

When adding a new sorting algorithm, add it under `src/algorithms/` as a `SortAlgorithm`, register it in the `ALGORITHMS` map in `main.ts`, and add an `<option>` to the `#algorithm` select in `index.html` — `Player` and `CanvasRenderer` stay algorithm-agnostic and need no changes unless a genuinely new kind of step is needed (in which case extend `AlgoEvent` and handle it in both `Player.applyEvent` and `CanvasRenderer`).

## Pathfinding visualizer

Same architecture, same rule, different domain: grid pathfinding algorithms are pure functions `(grid, start, end) => PathEvent[]` (the `PathfindingAlgorithm` type in `src/pathfinding/types.ts`). `Grid` is `boolean[][]` (`true` = wall); `Coord` is `{ row, col }`.

Event types: `frontier` (a cell was queued for exploration), `visit` (a cell was settled/processed), `path` (a cell is part of the final reconstructed route, emitted start-to-end once `end` is reached — absent entirely if no path exists).

**Algorithms implemented:** BFS, DFS, Dijkstra (linear-scan "extract-min", no heap — the grid is small enough that O(V²) doesn't matter), and A* (Manhattan-distance heuristic, admissible on a 4-directional unweighted grid so the path found is still shortest). All in `src/pathfinding/`, all behind `PathfindingAlgorithm`, selectable from the pathfinding view's dropdown. `gridUtils.ts` holds the traversal helpers (`neighborsOf`, `buildPathEvents`, etc.) shared by all four.

This is treated as its own vertical slice, parallel to the sorting one, rather than sharing `Player`/`CanvasRenderer`: the state being tracked (frontier/visited/path cell sets vs. a number array) and the render target (a grid of cells vs. bars) are different enough that forcing a shared abstraction would cost more than it'd save.

- `src/pathfinding/PathPlayer.ts` — timer-driven playback of a `PathEvent[]`, mirroring the sorting `Player`'s play/pause/step/reset/speed API. Unlike the sorting `Player`, it doesn't own the grid — only the frontier/visited/path highlight sets built up from events.
- `src/pathfinding/GridRenderer.ts` — paints the grid from `(grid, start, end, PathPlayerState)`. No timers, no algorithm knowledge.
- `src/pathfinding/controller.ts` — owns the mutable grid/start/end state, the wall/start/end paint-mode buttons, canvas mouse-drag painting, and the algorithm registry. Exposes one `initPathfinding()` that `main.ts` calls. This is where pathfinding's DOM wiring lives instead of in `main.ts`, since it's substantial enough to warrant its own module — unlike sorting's simpler wiring, which stays inline in `main.ts`.

Editing the grid (painting a wall, moving start/end, clearing walls) invalidates any computed run — the controller calls `player.load([])` to clear highlights immediately rather than leaving a stale visualization on screen. A fresh run requires clicking "Find Path" (or changing the algorithm dropdown, which re-runs automatically against the current grid/start/end).

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck + production build
- `npm run test` — run Vitest suite
- `npm run typecheck` — `tsc --noEmit`

## Environment note

System default Node is v16 (too old for Vite 7). Use `nvm use` (reads `.nvmrc`, pinned to v23.8.0) before running any npm scripts.
