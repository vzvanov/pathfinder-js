import { Point } from './Point.js'

export const pointType = new Map();
pointType.set('free', 0);
pointType.set('obstacle', 1);
pointType.set('bad', 2);
pointType.set('path', 3);
pointType.set('start', 4);
pointType.set('finish', 5);

export const trafficPattern = [
    { row: -1, column: 0 },
    { row: 0, column: -1 },
    { row: 1, column: 0 },
    { row: 0, column: 1 }
];

const obstacles = [];
obstacles.push([0, 1]);
obstacles.push([1, 3]);
obstacles.push([2, 1]);
obstacles.push([2, 3]);
obstacles.push([2, 7]);
obstacles.push([3, 1]);
obstacles.push([3, 4]);
obstacles.push([3, 7]);
obstacles.push([4, 4]);
obstacles.push([4, 7]);
obstacles.push([5, 1]);
obstacles.push([5, 2]);
obstacles.push([5, 3]);
obstacles.push([5, 5]);
obstacles.push([5, 7]);
obstacles.push([5, 8]);
obstacles.push([5, 9]);

export const initialData = {
    mazeHtml: document.querySelector('.maze'),
    numberRows: 7,
    numberColomns: 10,
    startPoint: new Point(0, 0),
    finishPoint: new Point(4, 8),
    obstacles,
};