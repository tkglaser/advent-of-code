import { Point } from "./utils/point";

const input = `<input here>`.split("\n")

class Rope {
  private readonly segments: Point[] = [];

  constructor(private readonly segmentCount: number, origin: Point) {
    for (let i = 0; i < segmentCount; ++i) {
      this.segments[i] = origin
    }
  }

  get head() {
    return this.segments[0]
  }

  get tail() {
    return this.segments[this.segmentCount - 1]
  }

  moveHead(delta: Point) {
    this.segments[0] = this.segments[0].add(delta)
    for (let i = 1; i < this.segmentCount; ++i) {
      this.moveSegment(i)
    }
  }

  private moveSegment(idx: number) {
    const distance = this.segments[idx - 1].sub(this.segments[idx]);
    if (distance.maxAbs() > 1) {
      const segmentMove = distance.bounded(1)
      this.segments[idx] = this.segments[idx].add(segmentMove)
    }
  }
}

function ropeMove(ropeLength: number) {
  const directions: Record<string, Point> = {
    "U": new Point(0, 1),
    "D": new Point(0, -1),
    "L": new Point(-1, 0),
    "R": new Point(1, 0),
  }

  const visited: Record<string, boolean> = {}

  const rope = new Rope(ropeLength, new Point(0, 0));

  visited[rope.tail.hash] = true

  for (const [dir, steps] of input.map(line => line.split(" "))) {
    let stepCtr = +steps;
    while (stepCtr > 0) {
      rope.moveHead(directions[dir])
      visited[rope.tail.hash] = true
      --stepCtr
    }
  }

  console.log(`[${Object.keys(visited).length}] positions visited`)
}


ropeMove(2) // part1
ropeMove(10) // part2