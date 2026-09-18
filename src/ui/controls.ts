import type { Player } from '../player/Player';

export interface ControlElements {
  playPauseButton: HTMLButtonElement;
  stepButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  speedSlider: HTMLInputElement;
  newArrayButton: HTMLButtonElement;
}

// Wires DOM controls to a Player instance. Knows nothing about algorithms
// or rendering — only calls Player's public methods.
export function bindControls(elements: ControlElements, player: Player, onNewArray: () => void): void {
  const { playPauseButton, stepButton, resetButton, speedSlider, newArrayButton } = elements;

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

  player.onChange((state) => {
    playPauseButton.textContent = state.isPlaying ? 'Pause' : 'Play';
    playPauseButton.disabled = state.isFinished && !state.isPlaying;
    stepButton.disabled = state.isFinished;
  });
}
