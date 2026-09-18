import './style.css';
import { bubbleSort } from './algorithms/bubbleSort';
import { insertionSort } from './algorithms/insertionSort';
import { selectionSort } from './algorithms/selectionSort';
import { quickSort } from './algorithms/quickSort';
import { mergeSort } from './algorithms/mergeSort';
import type { SortAlgorithm } from './algorithms/types';
import { Player } from './player/Player';
import { CanvasRenderer } from './render/CanvasRenderer';
import { bindControls, type ControlElements } from './ui/controls';

const ARRAY_SIZE = 20;
const MIN_VALUE = 5;
const MAX_VALUE = 100;

const ALGORITHMS: Record<string, SortAlgorithm> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  quick: quickSort,
  merge: mergeSort,
};

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
const algorithmSelect = requireElement<HTMLSelectElement>('#algorithm');

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

let currentArray: number[] = [];

function currentAlgorithm(): SortAlgorithm {
  return ALGORITHMS[algorithmSelect.value] ?? bubbleSort;
}

function runOn(array: number[]): void {
  currentArray = array.slice();
  player.load(currentArray, currentAlgorithm()(currentArray));
}

function startNewRun(): void {
  runOn(randomArray(ARRAY_SIZE));
}

algorithmSelect.addEventListener('change', () => {
  if (currentArray.length > 0) runOn(currentArray);
});

player.onChange((state) => renderer.draw(state));
bindControls(controlElements, player, startNewRun, runOn);

startNewRun();
