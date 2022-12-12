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
        return this.coords.reduce((max, curr) => Math.max(Math.abs(curr), max), 0)
    }

    bounded(max: number) {
        return new Point(...this.coords.map(value => (value < 0) ? Math.max(-max, value) : Math.min(max, value)))
    }

    equals(that: Point) {
        for (let i = 0; i < this.dim; ++i) {
            if (this.coords[i] !== that.coords[i]) {
                return false;
            }
        }
        return true;
    }

    get hash() {
        return this.coords.join("|");
    }
}
