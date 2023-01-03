import { Point, BoundingBox, PointCloud } from "./utils/point";

const input18 = `< input >`.split("\n");

class Droplet {
  #voxels = new PointCloud();
  #boundingBox = new BoundingBox();
  #neighbors = [
    new Point(+0, +0, -1),
    new Point(+0, +0, +1),
    new Point(+0, -1, +0),
    new Point(+0, +1, +0),
    new Point(-1, +0, +0),
    new Point(+1, +0, +0),
  ];

  get voxels() {
    return this.#voxels.points;
  }

  constructor(input: string[]) {
    this.#voxels.add(
      ...input.map(
        (line) => new Point(...line.split(",").map((coord) => +coord))
      )
    );

    this.#boundingBox.add(...this.voxels);
  }

  get surfaceArea() {
    let area = 0;
    for (const voxel of this.voxels) {
      for (const neighbor of this.#neighbors.map((n) => n.add(voxel))) {
        if (!this.#voxels.hasPointAt(neighbor)) {
          ++area;
        }
      }
    }

    return area;
  }

  get reachableSurfaceArea() {
    const water = new PointCloud();
    const max = this.#boundingBox.max.add(new Point(1, 1, 1));
    const min = this.#boundingBox.min.sub(new Point(1, 1, 1));
    water.add(min);
    let waterHasExpanded = false;
    do {
      waterHasExpanded = false;
      for (const waterCell of water.points) {
        for (const newCell of this.#neighbors.map((n) => n.add(waterCell))) {
          if (
            newCell.coords[0] < min.coords[0] ||
            max.coords[0] < newCell.coords[0]
          ) {
            continue;
          }
          if (
            newCell.coords[1] < min.coords[1] ||
            max.coords[1] < newCell.coords[1]
          ) {
            continue;
          }
          if (
            newCell.coords[2] < min.coords[2] ||
            max.coords[2] < newCell.coords[2]
          ) {
            continue;
          }
          if (!water.hasPointAt(newCell) && !this.#voxels.hasPointAt(newCell)) {
            water.add(newCell);
            waterHasExpanded = true;
          }
        }
      }
    } while (waterHasExpanded);

    let area = 0;
    for (const voxel of this.voxels) {
      for (const neighbor of this.#neighbors.map((n) => n.add(voxel))) {
        if (!this.#voxels.hasPointAt(neighbor) && water.hasPointAt(neighbor)) {
          ++area;
        }
      }
    }
    return area;
  }

  toString() {
    return this.voxels.map((v) => v.hash).join(" # ");
  }
}

const droplet = new Droplet(input18);

console.log(droplet.surfaceArea);
console.log(droplet.reachableSurfaceArea);
