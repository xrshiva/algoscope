import './style.css';
import { bubbleSort } from './algorithms/bubbleSort';
import { Player } from './player/Player';
import { CanvasRenderer } from './render/CanvasRenderer';
import { bindControls, type ControlElements } from './ui/controls';

const ARRAY_SIZE = 20;
const MIN_VALUE = 5;
const MAX_VALUE = 100;

function randomArray(size: number): number[] {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE,
  );
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
}

const canvas = requireElement<HTMLCanvasElement>('#canvas');
const renderer = new CanvasRenderer(canvas);
const player = new Player();

const controlElements: ControlElements = {
  playPauseButton: requireElement('#play-pause'),
  stepButton: requireElement('#step'),
  resetButton: requireElement('#reset'),
  speedSlider: requireElement('#speed'),
  newArrayButton: requireElement('#new-array'),
  customInput: requireElement('#custom-array'),
  runCustomButton: requireElement('#run-custom'),
  customError: requireElement('#custom-error'),
};

function runOn(array: number[]): void {
  player.load(array, bubbleSort(array));
}

function startNewRun(): void {
  runOn(randomArray(ARRAY_SIZE));
}

player.onChange((state) => renderer.draw(state));
bindControls(controlElements, player, startNewRun, runOn);

startNewRun();
