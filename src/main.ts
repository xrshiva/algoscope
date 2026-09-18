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
};

function startNewRun(): void {
  const array = randomArray(ARRAY_SIZE);
  const events = bubbleSort(array);
  player.load(array, events);
}

player.onChange((state) => renderer.draw(state));
bindControls(controlElements, player, startNewRun);

startNewRun();
