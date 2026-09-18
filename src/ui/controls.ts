import type { Player } from '../player/Player';

export interface ControlElements {
  playPauseButton: HTMLButtonElement;
  stepButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  speedSlider: HTMLInputElement;
  newArrayButton: HTMLButtonElement;
  customInput: HTMLInputElement;
  runCustomButton: HTMLButtonElement;
  customError: HTMLElement;
}

type ParseResult = { ok: true; values: number[] } | { ok: false; error: string };

// Accepts numbers separated by commas and/or whitespace, e.g. "5, 3, 8, 1".
export function parseNumberList(raw: string): ParseResult {
  const parts = raw
    .split(/[,\s]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return { ok: false, error: 'Enter at least one positive number.' };
  }

  const values: number[] = [];
  for (const part of parts) {
    const value = Number(part);
    if (!Number.isFinite(value) || value <= 0) {
      return { ok: false, error: `"${part}" is not a positive number.` };
    }
    values.push(value);
  }

  return { ok: true, values };
}

// Wires DOM controls to a Player instance. Knows nothing about algorithms
// or rendering — only calls Player's public methods.
export function bindControls(
  elements: ControlElements,
  player: Player,
  onNewArray: () => void,
  onCustomArray: (values: number[]) => void,
): void {
  const {
    playPauseButton,
    stepButton,
    resetButton,
    speedSlider,
    newArrayButton,
    customInput,
    runCustomButton,
    customError,
  } = elements;

  playPauseButton.addEventListener('click', () => {
    if (playPauseButton.textContent === 'Pause') {
      player.pause();
    } else {
      player.play();
    }
  });

  stepButton.addEventListener('click', () => player.stepForward());
  resetButton.addEventListener('click', () => player.reset());
  newArrayButton.addEventListener('click', onNewArray);

  speedSlider.addEventListener('input', () => {
    player.setSpeed(Number(speedSlider.value));
  });

  const runCustom = () => {
    const result = parseNumberList(customInput.value);
    if (!result.ok) {
      customError.textContent = result.error;
      return;
    }
    customError.textContent = '';
    onCustomArray(result.values);
  };

  runCustomButton.addEventListener('click', runCustom);
  customInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') runCustom();
  });

  player.onChange((state) => {
    playPauseButton.textContent = state.isPlaying ? 'Pause' : 'Play';
    playPauseButton.disabled = state.isFinished && !state.isPlaying;
    stepButton.disabled = state.isFinished;
  });
}
