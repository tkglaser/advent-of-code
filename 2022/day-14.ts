import { Point } from "./utils/point";

const input = `<input>>`.split("\n");

class Path {
  #points: Point[] = [];

  addPoint(p: Point) {
    this.#points.push(p);
  }

  render(): Point[] {
    const pointsInPath: Point[] = [];
    let cursor: Point = this.#points[0];
    let nextPointIdx = 1;
    pointsInPath.push(cursor);
    while (this.#points[nextPointIdx]) {
      const step = this.#points[nextPointIdx].sub(cursor).bounded(1);
      cursor = cursor.add(step);
      if (cursor.equals(this.#points[nextPointIdx])) {
        ++nextPointIdx;
      }
      pointsInPath.push(cursor);
    }
    return pointsInPath;
  }
}

type Paths = Path[];

const enum CellType {
  Air = ".",
  Rock = "#",
  Sand = "o",
}

class Cave {
  #cells: Record<string, CellType> = {};
  #maxX = 500;
  #minX = 500;
  #maxY = 0;
  #floorAttached = false;

  get maxX() {
    return this.#maxX;
  }
  get minX() {
    return this.#minX;
  }
  get maxY() {
    return this.#maxY;
  }

  attachFloor() {
    this.#floorAttached = true;
  }

  get(p: Point) {
    if (this.#floorAttached && p.coords[1] >= this.#maxY + 2) {
      return CellType.Rock;
    }
    const content = this.#cells[p.hash];
    if (typeof content === "undefined") {
      return CellType.Air;
    }
    return content;
  }

  set(p: Point, type: CellType) {
    this.#cells[p.hash] = type;
    // sand doesn't define the cave
    if (type === CellType.Rock) {
      if (p.coords[0] < this.#minX) {
        this.#minX = p.coords[0];
      }
      if (p.coords[0] > this.#maxX) {
        this.#maxX = p.coords[0];
      }
      if (p.coords[1] > this.#maxY) {
        this.#maxY = p.coords[1];
      }
    }
  }

  render() {
    for (let y = 0; y <= this.maxY; ++y) {
      let line = "";
      for (let x = this.minX; x <= this.maxX; ++x) {
        line = line + this.get(new Point(x, y));
      }
      console.log(line);
    }
  }
}

function parseInput(): Paths {
  const result: Paths = [];
  for (const line of input) {
    const currentPath = new Path();
    const lexed = line
      .split(" -> ")
      .map((coord) => coord.split(",").map((value) => +value));
    for (const [x, y] of lexed) {
      currentPath.addPoint(new Point(x, y));
    }
    result.push(currentPath);
  }
  return result;
}

function buildCave(paths: Paths) {
  const cave = new Cave();
  for (const path of paths) {
    for (const point of path.render()) {
      cave.set(point, CellType.Rock);
    }
  }
  return cave;
}

function simGrain(cave: Cave) {
  let sandPosition = new Point(500, 0);
  const sandMoves = [new Point(0, 1), new Point(-1, 1), new Point(1, 1)];
  let sandMoved = false;
  do {
    sandMoved = false;
    for (const nextDelta of sandMoves) {
      const potentialPoint = sandPosition.add(nextDelta);
      if (cave.get(potentialPoint) === CellType.Air) {
        sandPosition = potentialPoint;
        sandMoved = true;
        break;
      }
    }
    if (sandPosition.equals(new Point(500, 0))) {
      return false;
    }
    if (cave.maxY + 2 < sandPosition.coords[1]) {
      return false;
    }
  } while (sandMoved);
  cave.set(sandPosition, CellType.Sand);
  return true;
}

function simSand(cave: Cave) {
  let grainsDispatched = 0;
  do {
    ++grainsDispatched;
  } while (simGrain(cave));
  console.log(grainsDispatched ); // subtract one for part 1. That's the one that has dropped down
}

const parsedInput = parseInput();
const cave = buildCave(parsedInput);

cave.attachFloor(); // part 2

simSand(cave);

cave.render();
