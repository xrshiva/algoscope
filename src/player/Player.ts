import type { AlgoEvent } from '../algorithms/types';

export interface PlayerState {
  array: number[];
  event: AlgoEvent | null;
  sortedIndices: Set<number>;
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  isFinished: boolean;
}

type Listener = (state: PlayerState) => void;

const DEFAULT_DELAY_MS = 300;

// Steps through a fixed event list on a timer. Holds its own working copy
// of the array, reconstructed by replaying swap events — the algorithm
// that produced the events never sees this state.
export class Player {
  private original: number[] = [];
  private events: AlgoEvent[] = [];
  private array: number[] = [];
  private stepIndex = 0;
  private sortedIndices = new Set<number>();
  private timerId: ReturnType<typeof setInterval> | null = null;
  private delayMs = DEFAULT_DELAY_MS;
  private listeners: Listener[] = [];

  constructor(initial: number[] = [], events: AlgoEvent[] = []) {
    this.load(initial, events);
  }

  load(initial: number[], events: AlgoEvent[]): void {
    this.pause();
    this.original = initial.slice();
    this.events = events;
    this.array = initial.slice();
    this.stepIndex = 0;
    this.sortedIndices = new Set();
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
    this.load(this.original, this.events);
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

  private applyEvent(event: AlgoEvent): void {
    switch (event.type) {
      case 'compare':
        break;
      case 'swap': {
        const tmp = this.array[event.i];
        this.array[event.i] = this.array[event.j];
        this.array[event.j] = tmp;
        break;
      }
      case 'markSorted':
        this.sortedIndices.add(event.index);
        break;
    }
  }

  private emit(event: AlgoEvent | null): void {
    const state = this.getState(event);
    for (const listener of this.listeners) listener(state);
  }

  private getState(event: AlgoEvent | null): PlayerState {
    return {
      array: this.array.slice(),
      event,
      sortedIndices: new Set(this.sortedIndices),
      stepIndex: this.stepIndex,
      totalSteps: this.events.length,
      isPlaying: this.timerId !== null,
      isFinished: this.stepIndex >= this.events.length,
    };
  }
}
