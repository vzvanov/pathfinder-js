
const clearHtmlMaze = (mazeHtml) => {
  while (mazeHtml.firstChild) {
    mazeHtml.removeChild(mazeHtml.firstChild);
  }
}

const generateHtmlMaze = (mazeHtml, numberRows, numberColomns) => {
  for (let row = 0; row < numberRows; row++) {
    for (let col = 0; col < numberColomns; col++) {
      const cell = document.createElement('div');
      cell.classList.add('maze__cell');
      cell.id = generateId(row, col);
      const interior = document.createElement('div');
      interior.classList.add('sphere');
      cell.appendChild(interior);
      mazeHtml.append(cell);
    }
  }
}

const setHtmlObstacles = (obstacles) => {
  for (let item of obstacles) {
    const cell = document.getElementById(generateId(item[0], item[1]));
    cell.firstChild.classList.add('cell-obstacle');
  }
}

const setHtmlSpecialPoint = (point, className, text) => {
  const cell = document.getElementById(generateId(point.row, point.column));
  cell.firstChild.classList.add(className);
  cell.firstChild.innerHTML = text;
}

export const showHtmlMaze = (initialData) => {
  const { mazeHtml, startPoint, finishPoint, numberRows, numberColomns, obstacles } = initialData;
  clearHtmlMaze(mazeHtml);
  generateHtmlMaze(mazeHtml, numberRows, numberColomns);
  setHtmlObstacles(obstacles);
  setHtmlSpecialPoint(startPoint, 'cell-start', 'S');
  setHtmlSpecialPoint(finishPoint, 'cell-finish', 'F');
  mazeHtml.style.setProperty('--columnNumber', numberColomns);
}

const generateId = (row, column) => {
  return String(row) + "-" + String(column);
}

const cellFree = (point) => {
  const cell = document.getElementById(generateId(point.row, point.column));
  cell.firstChild.classList.remove('cell-obstacle');
}

const cellObstacles = (point) => {
  const cell = document.getElementById(generateId(point.row, point.column));
  cell.firstChild.classList.add('cell-obstacle');
}

const cellPath = (point) => {
  const cell = document.getElementById(generateId(point.row, point.column));
  cell.firstChild.classList.add('cell-path');
}

const cellBed = (point) => {
  const cell = document.getElementById(generateId(point.row, point.column));
  cell.firstChild.classList.remove('cell-path');
  cell.firstChild.classList.add('cell-bed');
}

export const executor = new Map();
executor.set(0, cellFree);
executor.set(1, cellObstacles);
executor.set(2, cellBed);
executor.set(3, cellPath);
