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

Event types: `compare` (highlight two indices), `swap` (exchange two indices in place), `overwrite` (write a value into an index — used by algorithms like merge sort that copy from a temp buffer rather than swap), `markSorted` (an index holds its final value and will never change again).

**`markSorted` must only be emitted when that's actually true.** Bubble/selection sort can mark an index sorted immediately, since the value there is provably final. Insertion/merge sort cannot know any index is final until the whole array is done, so they mark everything sorted in one sweep at the end rather than progressively. Get this wrong and the renderer shows green on a bar that later changes value.

## Algorithms implemented

Bubble, insertion, selection, quick (Lomuto partition), and merge sort — all in `src/algorithms/`, all behind the `SortAlgorithm` interface, selectable from the UI dropdown.

## Module boundaries

- `src/algorithms/` — pure functions producing `AlgoEvent[]`. No imports from `render/` or `player/`, no DOM references. This is the only place `SortAlgorithm` implementations live.
- `src/player/` — `Player` steps through a fixed event list on a timer (play/pause/step/reset/speed). Owns a working copy of the array, reconstructed by replaying `swap`/`overwrite` events — the algorithm that produced the events never sees this state. Knows nothing about how to draw.
- `src/render/` — `CanvasRenderer` takes a state snapshot and paints bars to canvas. No timers, no algorithm knowledge, never mutates its input.
- `src/ui/` — wires DOM controls (buttons, slider, custom-array input) to `Player`'s public methods. No algorithm or rendering knowledge.
- `src/main.ts` — the only file that imports across all of the above; wires everything together, including the algorithm-name → `SortAlgorithm` registry and the algorithm `<select>`.

When adding a new algorithm, add it under `src/algorithms/` as a `SortAlgorithm`, register it in the `ALGORITHMS` map in `main.ts`, and add an `<option>` to the `#algorithm` select in `index.html` — `Player` and `CanvasRenderer` stay algorithm-agnostic and need no changes unless a genuinely new kind of step is needed (in which case extend `AlgoEvent` and handle it in both `Player.applyEvent` and `CanvasRenderer`).

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck + production build
- `npm run test` — run Vitest suite
- `npm run typecheck` — `tsc --noEmit`

## Environment note

System default Node is v16 (too old for Vite 7). Use `nvm use` (reads `.nvmrc`, pinned to v23.8.0) before running any npm scripts.
