import { Point, BoundingBox } from "./utils/point";

const input17 = `< input >`;

class Rock {
  #shape: Record<string, Point> = {};

  constructor(shapeDescription: string[]) {
    const reversedShapeDescription = [...shapeDescription].reverse();
    reversedShapeDescription.forEach((line, y) => {
      line.split("").forEach((char, x) => {
        if (char === "#") {
          const p = new Point(x, y);
          this.#shape[p.hash] = p;
        }
      });
    });
  }

  get points() {
    return Object.values(this.#shape);
  }

  getPointsWithOffset(offset: Point) {
    return Object.values(this.#shape).map((p) => p.add(offset));
  }

  get width() {
    return this.points.reduce((w, curr) => Math.max(w, curr.coords[0]), 0);
  }

  get height() {
    return this.points.reduce((w, curr) => Math.max(w, curr.coords[1]), 0);
  }

  isSolidAt(p: Point) {
    return !!this.#shape[p.hash];
  }

  toString() {
    return this.points.map((p) => p.hash).join(" # ");
  }
}

class Jet {
  #directions: string;
  #position = 0;
  constructor(input: string) {
    this.#directions = input;
  }

  popDirection() {
    let direction = this.#directions.charAt(this.#position);
    if (!["<", ">"].includes(direction)) {
      this.#position = 0;
    }

    direction = this.#directions.charAt(this.#position++);
    return direction === "<" ? new Point(-1, 0) : new Point(1, 0);
  }
}

class Chamber {
  #highWater = 0;
  #rockCells: Record<string, Point> = {};
  #currentRockPosition!: Point;
  #currentRock!: Rock;

  get highWater() {
    return this.#highWater;
  }

  addRock(rock: Rock) {
    this.#currentRock = rock;
    this.#currentRockPosition = new Point(2, this.#highWater + 3);
  }

  tryMove(direction: Point): boolean {
    const downwards = new Point(0, -1);
    let newRockPosition = this.#currentRockPosition.add(direction);

    // move horizontal
    let newRockPoints = this.#currentRock.getPointsWithOffset(newRockPosition);
    if (!this.collides(newRockPoints)) {
      this.#currentRockPosition = newRockPosition;
    }

    newRockPosition = this.#currentRockPosition.add(downwards);
    newRockPoints = this.#currentRock.getPointsWithOffset(newRockPosition);
    if (!this.collides(newRockPoints)) {
      this.#currentRockPosition = newRockPosition;
      return true; // moved
    }

    // has collided, solidify
    this.#currentRock
      .getPointsWithOffset(this.#currentRockPosition)
      .forEach((p) => {
        this.#rockCells[p.hash] = p;
      });

    this.#highWater =
      Object.values(this.#rockCells).reduce(
        (total, curr) => Math.max(total, curr.coords[1]),
        0
      ) + 1;
    return false;
  }

  toString() {
    const bb = new BoundingBox();
    bb.add(new Point(0, 0));
    Object.values(this.#rockCells).forEach((c) => {
      bb.add(c);
    });

    this.#currentRock.points.forEach((p) =>
      bb.add(p.add(this.#currentRockPosition))
    );

    let lines: string[] = [];

    for (let y = 0; y < bb.max.coords[1] + 1; ++y) {
      let line = "";
      for (let x = 0; x < 7; ++x) {
        const currPoint = new Point(x, y);
        if (this.#rockCells[currPoint.hash]) {
          line += "#";
        } else if (
          this.#currentRock.isSolidAt(currPoint.sub(this.#currentRockPosition))
        ) {
          line += "@";
        } else {
          line += ".";
        }
      }
      lines.unshift(line);
    }
    return lines.join("\n") + "\n";
  }

  private collides(points: Point[]) {
    for (const point of points) {
      if (point.coords[1] < 0 || point.coords[0] < 0 || point.coords[0] > 6) {
        return true;
      }
      if (this.#rockCells[point.hash]) {
        return true;
      }
    }
    return false;
  }
}

const rocks = [
  [`####`],
  [`.#.`, `###`, `.#.`],
  [`..#`, `..#`, `###`],
  [`#`, `#`, `#`, `#`],
  [`##`, `##`],
].map((definition) => new Rock(definition));

const jet = new Jet(input17);

const chamber = new Chamber();

function part1() {
  let currRock = 0;
  let rocksToDrop = 1000000000000;
  chamber.addRock(rocks[currRock]);
  while (rocksToDrop) {
    // console.log(chamber.toString());
    const jetDirection = jet.popDirection();
    const hasMoved = chamber.tryMove(jetDirection);
    if (!hasMoved) {
      //   console.log(chamber.toString());
      if (!rocks[++currRock]) {
        currRock = 0;
      }
      chamber.addRock(rocks[currRock]);
      --rocksToDrop;
      if (rocksToDrop % 100 === 0) {
        console.log(`[${rocksToDrop}] rocks to drop`);
      }
    }
  }

  console.log(chamber.highWater);
}

part1();
