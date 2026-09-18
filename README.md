# Algoscope

A web-based algorithm visualizer. Watch algorithms run step by step instead of just reading code. Two visualizers, one page, a tab switcher between them.

**Live demo:** https://xrshiva.github.io/algoscope/

## How it works

Algorithms don't return results — they emit a chronological list of typed events describing every step. A player steps through that event list on a timer, and a canvas renderer paints the current state. The algorithm code never touches rendering, timing, or the DOM.

**Sorting** — pure functions `(input: number[]) => AlgoEvent[]` (`compare`, `swap`, `overwrite`, `markSorted`), drawn as bars. Implemented: **bubble, insertion, selection, quick, and merge sort** — pick one from the dropdown. You can also type your own array (e.g. `5, 3, 8, 1`) and run any algorithm on exactly that input.

**Pathfinding** — pure functions `(grid, start, end) => PathEvent[]` (`frontier`, `visit`, `path`), drawn as a grid. Implemented: **BFS, DFS, Dijkstra, and A\*** on a 4-directional grid. Draw walls by dragging, place start/end, pick an algorithm, and click Find Path.

## Stack

- TypeScript (strict)
- Vite
- Canvas 2D — no charting or animation libraries
- Vitest
- No UI framework

## Getting started

```bash
nvm use        # this repo pins Node via .nvmrc
npm install
npm run dev    # start the dev server
npm run test   # run the Vitest suite
npm run build  # typecheck + production build
```

## Project structure

```
src/
├── algorithms/   # sorting: pure functions producing AlgoEvent[] — no DOM, no rendering
├── player/       # sorting: steps through events on a timer (play/pause/step/reset/speed)
├── render/       # sorting: CanvasRenderer — paints bars from a state snapshot
├── ui/           # sorting: wires DOM controls to the Player
├── pathfinding/  # pathfinding: algorithms, PathPlayer, GridRenderer, and controller.ts (its own DOM wiring)
└── main.ts       # bootstraps the tab switcher, sorting, and pathfinding
```

See `CLAUDE.md` for the full module-boundary rules.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the site and publishes it to GitHub Pages.
