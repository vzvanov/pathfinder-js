import { Point } from './Point.js'

export class Step {

  constructor(point, parent = undefined) {
    this.point = point;
    this.possibleSteps = [];
    this.parent = parent;
  }

  findPossibleSteps(maze, trafficPattern) {
    this.possibleSteps = [];
    for (let i = 0; i < trafficPattern.length; i++) {
      const row = this.point.row + trafficPattern[i].row;
      const column = this.point.column + trafficPattern[i].column;
      let pointValue = undefined;

      try {
        pointValue = maze[row][column];
      } catch (error) {
        continue;
      }

      if (pointValue === undefined) continue;
      if (pointValue) continue;
      if (pointValue !== 0) continue;

      this.possibleSteps.push(new Point(row, column));
    }
  }

}
