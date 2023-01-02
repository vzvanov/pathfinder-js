export class Point {

  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  isSame(point) {
    return (this.row === point.row) && (this.column === point.column);
  }

}
