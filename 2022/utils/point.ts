export class Point {
    public readonly coords: ReadonlyArray<number>; // Point instances are immutable
    public readonly dim: number;
  
    constructor(...coords: number[]) {
      this.coords = coords;
      this.dim = coords.length;
    }
  
    add(that: Point) {
      const results: number[] = [];
      for (let i = 0; i < this.dim; ++i) {
        results[i] = this.coords[i] + that.coords[i];
      }
      return new Point(...results);
    }
  
    sub(that: Point) {
      const results: number[] = [];
      for (let i = 0; i < this.dim; ++i) {
        results[i] = this.coords[i] - that.coords[i];
      }
      return new Point(...results);
    }
  
    maxAbs() {
      return this.coords.reduce((max, curr) => Math.max(Math.abs(curr), max), 0);
    }
  
    bounded(max: number) {
      return new Point(
        ...this.coords.map((value) =>
          value < 0 ? Math.max(-max, value) : Math.min(max, value)
        )
      );
    }
  
    equals(that: Point) {
      for (let i = 0; i < this.dim; ++i) {
        if (this.coords[i] !== that.coords[i]) {
          return false;
        }
      }
      return true;
    }
  
    distance(other: Point) {
      // manhattan distance
      return other.sub(this).length;
    }
  
    get hash() {
      return this.coords.join("|");
    }
  
    get length() {
      // manhattan length
      return this.coords.reduce((length, coord) => length + Math.abs(coord), 0);
    }
  }
  
  export class BoundingBox {
    #min!: Point;
    #max!: Point;
  
    add(...points: Point[]) {
      for (const point of points) {
        this.addPoint(point);
      }
    }
  
    private addPoint(point: Point) {
      const dim = point.dim;
      const min: number[] = [];
      const max: number[] = [];
      for (let idx = 0; idx < dim; ++idx) {
        for (const p of [this.#min, this.#max, point].filter(Boolean)) {
          if (typeof min[idx] === "undefined") {
            min[idx] = p.coords[idx];
          } else {
            min[idx] = Math.min(min[idx], p.coords[idx]);
          }
          if (typeof max[idx] === "undefined") {
            max[idx] = p.coords[idx];
          } else {
            max[idx] = Math.max(max[idx], p.coords[idx]);
          }
        }
      }
  
      this.#min = new Point(...min);
      this.#max = new Point(...max);
    }
  
    get min() {
      return this.#min;
    }
  
    get max() {
      return this.#max;
    }
  }
  
  export class PointCloud {
    #points: Record<string, Point> = {};
  
    get points() {
      return Object.values(this.#points);
    }
  
    add(...points: Point[]) {
      for (const point of points) {
        this.#points[point.hash] = point;
      }
    }
  
    hasPointAt(point: Point) {
      return !!this.#points[point.hash];
    }
  
    toString() {
      return this.points.map((p) => p.hash).join(" # ");
    }
  }
  