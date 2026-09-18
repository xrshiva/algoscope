import type { AlgoEvent } from '../algorithms/types';
import type { PlayerState } from '../player/Player';

const COLOR_DEFAULT = '#94a3b8';
const COLOR_COMPARE = '#f59e0b';
const COLOR_SWAP = '#ef4444';
const COLOR_SORTED = '#22c55e';
const BAR_GAP = 2;
const TOP_MARGIN = 20;

// Draws the array as vertical bars. Takes a snapshot of player state and
// paints it — has no timers, no algorithm knowledge, no mutation of its input.
export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
  }

  draw(state: PlayerState): void {
    const { array, event, sortedIndices } = state;
    const { ctx, canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (array.length === 0) return;

    const barWidth = canvas.width / array.length;
    const maxValue = Math.max(...array);
    const highlighted = highlightedIndices(event);

    array.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height - TOP_MARGIN);
      const x = index * barWidth;
      const y = canvas.height - barHeight;

      ctx.fillStyle = colorFor(index, highlighted, event, sortedIndices);
      ctx.fillRect(x + BAR_GAP / 2, y, barWidth - BAR_GAP, barHeight);
    });
  }
}

function highlightedIndices(event: AlgoEvent | null): number[] {
  if (event && (event.type === 'compare' || event.type === 'swap')) {
    return [event.i, event.j];
  }
  return [];
}

function colorFor(
  index: number,
  highlighted: number[],
  event: AlgoEvent | null,
  sortedIndices: Set<number>,
): string {
  if (sortedIndices.has(index)) return COLOR_SORTED;
  if (highlighted.includes(index)) {
    return event?.type === 'swap' ? COLOR_SWAP : COLOR_COMPARE;
  }
  return COLOR_DEFAULT;
}
