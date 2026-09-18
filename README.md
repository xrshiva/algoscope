# Algoscope

A web-based algorithm visualizer. Watch algorithms run step by step instead of just reading code.

**Live demo:** https://xrshiva.github.io/algoscope/

## How it works

Algorithms don't return results — they emit a chronological list of typed events describing every step (`compare`, `swap`, `markSorted`). A player steps through that event list on a timer, and a canvas renderer paints bars from the current state. The algorithm code never touches rendering, timing, or the DOM — it's a pure function `(input: number[]) => AlgoEvent[]`.

Currently implemented: **bubble sort**.

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
├── algorithms/   # pure functions producing AlgoEvent[] — no DOM, no rendering
├── player/       # steps through events on a timer (play/pause/step/reset/speed)
├── render/       # CanvasRenderer — paints bars from a state snapshot
├── ui/           # wires DOM controls to the Player
└── main.ts       # wires everything together
```

See `CLAUDE.md` for the full module-boundary rules.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the site and publishes it to GitHub Pages.
