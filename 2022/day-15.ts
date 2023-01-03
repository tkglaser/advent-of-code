import { BoundingBox, Point } from "./utils/point";

const input = `< input >`.split("\n");

type LineSection = { min: number; max: number };

class Sensor {
  #radius: number;
  constructor(readonly position: Point, readonly beacon: Point) {
    this.#radius = position.distance(beacon);
  }

  get radius() {
    return this.#radius;
  }

  isInRange(p: Point) {
    if (p.equals(this.beacon)) {
      return false;
    }
    return this.position.distance(p) <= this.radius;
  }

  lineSection(line: number): LineSection | undefined {
    const verticalDistance = Math.abs(line - this.position.coords[1]);
    const sheer = verticalDistance - this.#radius;
    if (sheer <= 0) {
      return undefined;
    }
    return {
      min: this.position.coords[0] - sheer,
      max: this.position.coords[0] + sheer,
    };
  }
}

class SensorField {
  #sensors: Sensor[] = [];
  #boundingBox = new BoundingBox();

  addSensor(sensor: Sensor) {
    this.#sensors.push(sensor);

    this.#boundingBox.add(sensor.position.add(new Point(-sensor.radius, 0)));
    this.#boundingBox.add(sensor.position.add(new Point(+sensor.radius, 0)));
    this.#boundingBox.add(sensor.position.add(new Point(0, -sensor.radius)));
    this.#boundingBox.add(sensor.position.add(new Point(0, +sensor.radius)));
  }

  isInRange(p: Point) {
    return this.#sensors.some((sensor) => sensor.isInRange(p));
  }

  lineSections(line: number): LineSection[] {
    return this.#sensors
      .map((sensor) => sensor.lineSection(line))
      .filter(Boolean) as LineSection[];
  }

  get boundingBox() {
    return this.#boundingBox;
  }
}

function mergeLineSections(lineSections: LineSection[]) {
  const sections = [...lineSections];

  const canBeMerged = (a: LineSection, b: LineSection) =>
    !(a.max <= b.min) && !(b.max <= a.min);

  const merge = (a: LineSection, b: LineSection) => ({
    min: Math.min(a.min, b.min),
    max: Math.max(a.max, b.max),
  });

  let noMergeCounter = sections.length;
  do {
    const item = sections.shift()!;
    let mergeIdx = -1;
    sections.forEach((section, idx) => {
      if (canBeMerged(section, item)) {
        mergeIdx = idx;
      }
    });

    if (mergeIdx > -1) {
      const [section] = sections.splice(mergeIdx, 1);
      noMergeCounter = 0;
      sections.push(merge(section, item));
    } else {
      ++noMergeCounter;
      sections.push(item);
    }
  } while (noMergeCounter <= sections.length);
  return sections;
}

function parseInput() {
  const field = new SensorField();
  for (const line of input) {
    const [, x, , y, , a, , b] = line
      .split("=")
      .flatMap((item) => item.split(","))
      .flatMap((item) => item.split(":"));
    const position = new Point(+x, +y);
    const beacon = new Point(+a, +b);
    field.addSensor(new Sensor(position, beacon));
  }
  return field;
}

function part1(field: SensorField, y: number) {
  let positions = 0;
  for (
    let x = field.boundingBox.min.coords[0];
    x <= field.boundingBox.max.coords[0];
    ++x
  ) {
    if (field.isInRange(new Point(x, y))) {
      ++positions;
    }
  }
  console.log(positions);
}

function part2(field: SensorField) {
  const areaMax = 20; //4000000
  let positions = 0;
  for (let y = 0; y < areaMax; ++y) {
    const lineSections = field.lineSections(y);
    console.log(mergeLineSections(lineSections));
  }
  console.log(positions);
}

const field = parseInput();

// part1(
//   field,
//   // 10
//   2000000
// );
part2(field);
