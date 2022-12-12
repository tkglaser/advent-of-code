import { Point } from "./utils/point";

const input = `<input>`.split("\n");

class Terrain {
    map: number[] = [];
    dim: number[] = [];
    dims: number = 2;
    start!: Point;
    end!: Point;

    constructor() {
        let y = 0;
        for (const line of input) {
            this.dim[0] = line.length;
            line.split("").forEach((char, x) => {
                const heightLetter = char === "S" ? "a" : char === "E" ? "z" : char;
                const height = heightLetter.charCodeAt(0) - "a".charCodeAt(0);
                if (char === "S") {
                    this.start = new Point(x, y);
                }
                if (char === "E") {
                    this.end = new Point(x, y);
                }
                this.map.push(height);
            });
            ++y;
        }
        this.dim[1] = y;
    }

    get(point: Point) {
        for (let i = 0; i < this.dims; ++i) {
            if (point.coords[i] < 0 || this.dim[i] <= point.coords[i]) {
                return Number.MAX_VALUE;
            }
        }
        const idx = point.coords[0] + this.dim[0] * point.coords[1];
        return this.map[idx];
    }
}

class MarkChart {
    #marks: Record<string, number> = {};

    set(point: Point, value: number) {
        this.#marks[point.hash] = value;
    }

    get(point: Point) {
        return this.#marks[point.hash] ?? Number.MAX_VALUE;
    }
}

function findShortestDistanceFrom(
    map: Terrain,
    start: Point,
    forward: boolean,
    exitCondition: (point: Point) => boolean
) {
    const marks = new MarkChart();

    const nextDeltas = [
        new Point(1, 0),
        new Point(0, 1),
        new Point(0, -1),
        new Point(-1, 0),
    ];

    marks.set(start, 0);

    const nextPoints: { p: Point; l: number }[] = [{ p: start, l: 0 }];

    do {
        const currentPoint = nextPoints.shift();

        if (!currentPoint) {
            return Number.MAX_VALUE; // no path found
        }

        if (exitCondition(currentPoint.p)) {
            return currentPoint.l;
        }

        const currentElevation = map.get(currentPoint.p);

        for (const delta of nextDeltas) {
            const nextLevel = currentPoint.l + 1;
            const nextPoint = currentPoint.p.add(delta);
            const nextPointElevation = map.get(nextPoint);
            if (
                (forward && nextPointElevation <= currentElevation + 1) ||
                (!forward && currentElevation <= nextPointElevation + 1)
            ) {
                if (marks.get(nextPoint) > nextLevel) {
                    marks.set(nextPoint, nextLevel);
                    nextPoints.push({ p: nextPoint, l: nextLevel });
                }
            }
        }
    } while (true);
}

function part1() {
    const map = new Terrain();

    console.log(
        findShortestDistanceFrom(map, map.start, true, (p) => p.equals(map.end))
    );
}

function part2() {
    const map = new Terrain();

    console.log(
        findShortestDistanceFrom(map, map.end, false, (p) => map.get(p) === 0)
    );
}

part1();
part2();
