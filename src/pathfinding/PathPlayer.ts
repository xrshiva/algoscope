import type { PathEvent } from './types';

export interface PathPlayerState {
  event: PathEvent | null;
  frontier: Set<string>;
  visited: Set<string>;
  path: Set<string>;
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  isFinished: boolean;
}

type Listener = (state: PathPlayerState) => void;

const DEFAULT_DELAY_MS = 40;

// Steps through a fixed PathEvent list on a timer. Unlike the sorting
// Player, it doesn't own an "array" to reconstruct — the grid, start, and
// end live in the controller. This just tracks which cells are frontier,
// visited, or on the final path.
export class PathPlayer {
  private events: PathEvent[] = [];
  private stepIndex = 0;
  private frontier = new Set<string>();
  private visited = new Set<string>();
  private path = new Set<string>();
  private timerId: ReturnType<typeof setInterval> | null = null;
  private delayMs = DEFAULT_DELAY_MS;
  private listeners: Listener[] = [];

  load(events: PathEvent[]): void {
    this.pause();
    this.events = events;
    this.stepIndex = 0;
    this.frontier = new Set();
    this.visited = new Set();
    this.path = new Set();
    this.emit(null);
  }

  onChange(listener: Listener): void {
    this.listeners.push(listener);
  }

  play(): void {
    if (this.timerId !== null || this.stepIndex >= this.events.length) return;
    this.timerId = setInterval(() => this.advance(), this.delayMs);
    this.emit(null);
  }

  pause(): void {
    if (this.timerId === null) return;
    clearInterval(this.timerId);
    this.timerId = null;
    this.emit(null);
  }

  stepForward(): void {
    this.pause();
    this.advance();
  }

  reset(): void {
    this.load(this.events);
  }

  setSpeed(ms: number): void {
    this.delayMs = ms;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = setInterval(() => this.advance(), this.delayMs);
    }
  }

  private advance(): void {
    if (this.stepIndex >= this.events.length) {
      this.pause();
      return;
    }

    const event = this.events[this.stepIndex];
    this.applyEvent(event);
    this.stepIndex++;
    this.emit(event);

    if (this.stepIndex >= this.events.length) {
      this.pause();
    }
  }

  private applyEvent(event: PathEvent): void {
    const cellKey = `${event.row},${event.col}`;
    switch (event.type) {
      case 'frontier':
        this.frontier.add(cellKey);
        break;
      case 'visit':
        this.frontier.delete(cellKey);
        this.visited.add(cellKey);
        break;
      case 'path':
        this.path.add(cellKey);
        break;
    }
  }

  private emit(event: PathEvent | null): void {
    const state = this.getState(event);
    for (const listener of this.listeners) listener(state);
  }

  private getState(event: PathEvent | null): PathPlayerState {
    return {
      event,
      frontier: new Set(this.frontier),
      visited: new Set(this.visited),
      path: new Set(this.path),
      stepIndex: this.stepIndex,
      totalSteps: this.events.length,
      isPlaying: this.timerId !== null,
      isFinished: this.stepIndex >= this.events.length,
    };
  }
}
