import { Step } from './source/Step.js';
import { showHtmlMaze, executor } from './source/html.js';
import { pointType, trafficPattern, initialData } from './source/constants.js';
import { Point } from './source/Point.js';

let isFind = false;
let countBranch = 1;

const buttonStart = document.querySelector('.btn-start');
buttonStart.onclick = () => {
  info.textContent = '';
  markMazePoint(initialData.finishPoint, 'free');
  buttonStart.disabled = true;
  buttonClear.disabled = true;
  buttonClearAll.disabled = true;
  mazeHtml.removeEventListener('click', handleMazeClick);
  startFinding(initialData);
}

const buttonClear = document.querySelector('.btn-clear');
buttonClear.onclick = () => {
  info.textContent = '';
  buttonStart.disabled = false;
  mazeHtml.addEventListener('click', handleMazeClick);
  clearMaze();
  isFind = false;
  showHtmlMaze(initialData);
  countBranch = 1;
}

const buttonClearAll = document.querySelector('.btn-all');
buttonClearAll.onclick = () => {
  info.textContent = '';
  buttonStart.disabled = false;
  mazeHtml.addEventListener('click', handleMazeClick);
  clearMaze(true);
  isFind = false;
  showHtmlMaze(initialData);
  countBranch = 1;
}

const info = document.querySelector('.info');

const clearMaze = (clearObstacles = false) => {
  let row = 0;
  for (let r of maze) {
    let column = 0;
    for (let value of r) {
      if (value === 3) maze[row][column] = 0;
      if (clearObstacles && value === 1) maze[row][column] = 0;
      column++;
    }
    row++;
  }
  if (clearObstacles) initialData.obstacles = [];
}

const getObstacles = () => {
  const obstacles = [];
  let row = 0;
  for (let r of maze) {
    let column = 0;
    for (let value of r) {
      if (value === 1) obstacles.push([row, column]);
      column++;
    }
    row++;
  }

  return obstacles;
}

let selectedSpecialPoint = undefined;

const handleMazeClick = (e) => {
  let element = e.target;
  const classList = element.classList;

  if (classList.contains('maze')) return;

  let id = undefined;
  if (classList.contains('maze__cell')) {
    element = e.target;
  }

  if (classList.contains('sphere')) {
    element = e.path[1];
  }
  id = element.id;

  const rowColumn = id.split('-');
  const row = Number(rowColumn[0]);
  const column = Number(rowColumn[1]);
  const value = maze[row][column];

  let newPoint = new Point(row, column);

  if (selectedSpecialPoint) {
    if (value === 0) {
      maze[row][column] = selectedSpecialPoint.value;
      maze[selectedSpecialPoint.row][selectedSpecialPoint.column] = 0;
    }

    const temp = new Point(selectedSpecialPoint.row, selectedSpecialPoint.column);

    if (initialData.startPoint.isSame(temp)) {
      initialData.startPoint = newPoint;
    }
    if (initialData.finishPoint.isSame(temp)) {
      initialData.finishPoint = newPoint;
    }

    selectedSpecialPoint = undefined;
    showHtmlMaze(initialData);
    return;
  }

  if (value === 1) {
    maze[row][column] = 0;
    initialData.obstacles = getObstacles(maze);
    showHtmlMaze(initialData);
  }

  if (value === 0) {
    maze[row][column] = 1;
    initialData.obstacles = getObstacles(maze);
    showHtmlMaze(initialData);
  }

  if (initialData.startPoint.isSame(newPoint)) {
    element.classList.add('cell-selected');
    selectedSpecialPoint = {
      row,
      column,
      value
    }
  }

  if (initialData.finishPoint.isSame(newPoint)) {
    element.classList.add('cell-selected');
    selectedSpecialPoint = {
      row,
      column,
      value
    }
  }

}

const { mazeHtml } = initialData;
mazeHtml.addEventListener('click', handleMazeClick);

const generateMaze = (numberRows, numberColomns) => {
  const maze = [];
  const free = pointType.get('free');

  for (let row = 0; row < numberRows; row++) {
    const temp = [];
    for (let col = 0; col < numberColomns; col++) {
      temp.push(free);
    }
    maze.push(temp);
  }
  return maze;
}

const setObstacles = (maze, obstacles) => {
  let typeObstacle = pointType.get('obstacle');
  for (let item of obstacles) {
    maze[item[0]][item[1]] = typeObstacle;
  }
}

const startFinding = (initialData) => {
  const { startPoint, finishPoint } = initialData;
  findWay(startPoint, finishPoint);
}

const findWay = (startPoint, finishPoint) => {
  markMazePoint(startPoint, 'start');
  makeNextStep(new Step(startPoint), finishPoint);
}

const makeNextStep = (currentStep, finishPoint) => {

  countBranch--;

  if (isFind) return;
  currentStep.findPossibleSteps(maze, trafficPattern);

  for (const currentPoint of currentStep.possibleSteps) {
    if (currentPoint) {
      markMazePoint(currentPoint, 'path');
      if (currentPoint.isSame(finishPoint)) {
        markMazePoint(currentPoint, 'finish');
        isFind = true;
        setTimeout(showPath, 0, new Step(finishPoint, currentStep), initialData);
        return;
      };
      countBranch++;
      setTimeout(makeNextStep, 100, new Step(currentPoint, currentStep), finishPoint);
    }

    showStep(currentStep);
    if (currentPoint) {
      showStep(new Step(currentPoint));
    }
  }

  if (countBranch === 0) {
    showPath(new Step(startPoint), initialData);
    info.textContent = 'Path not found.';
  }

}

const markMazePoint = (point, marker) => {
  maze[point.row][point.column] = pointType.get(marker);
}

const showStep = (step) => {
  const { point } = step;
  const ex = executor.get(maze[point.row][point.column]);
  ex && ex(point);
}

const showPath = (point, initialData) => {
  showHtmlMaze(initialData);
  let parent = point.parent;
  while (parent) {
    showStep(parent);
    parent = parent.parent;
  }
  buttonClear.disabled = false;
  buttonClearAll.disabled = false;
}

const { numberRows, numberColomns, startPoint, finishPoint, obstacles } = initialData;
const maze = generateMaze(numberRows, numberColomns);
setObstacles(maze, obstacles);
markMazePoint(startPoint, 'start');
markMazePoint(finishPoint, 'finish');
showHtmlMaze(initialData);
