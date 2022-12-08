const input = `<input>`.split("\n")

class Grid<T> {
  private grid: T[][] = []

  public get lengthX() {
    return this.#maxX + 1
  }

  public get lengthY() {
    return this.#maxY + 1
  }

  #maxX = 0
  #maxY = 0

  set(x: number, y: number, value: T) {
    if (!Array.isArray(this.grid[x])) {
      this.grid[x] = []
    }
    this.grid[x][y] = value;
    this.#maxX = Math.max(this.#maxX, x)
    this.#maxY = Math.max(this.#maxY, y)
  }

  get(x: number, y: number, defaultValue: T): T {
    return this.grid[x]?.[y] ?? defaultValue;
  }
}

function parseGrid() {
  const grid = new Grid<number>()
  input.forEach((line, y) => {
    for (let x = 0; x < line.length; ++x) {
      grid.set(x, y, +line.charAt(x))
    }
  })
  return grid;
}

function sweep(forest: Grid<number>, start: number[], direction: number[]) {
  let [x, y] = start
  const [dx, dy] = direction
  const sweepVisible = new Grid<boolean>()
  let highestSoFar = -1;
  do {
    const currentHeight = forest.get(x, y, -1)
    if (highestSoFar < currentHeight) {
      highestSoFar = currentHeight
      sweepVisible.set(x, y, true)
    } else {
      sweepVisible.set(x, y, false)
    }
    x += dx
    y += dy
  } while (x >= 0 && x < forest.lengthX && y >= 0 && y < forest.lengthY)
  return sweepVisible
}

function scenicSweep(forest: Grid<number>, start: number[], direction: number[]) {
  let [x, y] = start
  const [dx, dy] = direction
  let distance = 0;
  const targetHeight = forest.get(x, y, -1)
  x += dx
  y += dy

  while (x >= 0 && x < forest.lengthX && y >= 0 && y < forest.lengthY) {
    const currentHeight = forest.get(x, y, -1)
    ++distance
    if (currentHeight >= targetHeight) {
      return distance
    }
    x += dx
    y += dy
  }
  return distance
}

function part1() {
  const forest = parseGrid()
  const sweeps: Grid<boolean>[] = []
  for (let x = 0; x < forest.lengthX; ++x) {
    sweeps.push(sweep(forest, [x, 0], [0, 1]))
    sweeps.push(sweep(forest, [x, forest.lengthY - 1], [0, -1]))
  }
  for (let y = 0; y < forest.lengthY; ++y) {
    sweeps.push(sweep(forest, [0, y], [1, 0]))
    sweeps.push(sweep(forest, [forest.lengthX - 1, y], [-1, 0]))
  }
  let visible = 0
  for (let x = 0; x < forest.lengthX; ++x) {
    for (let y = 0; y < forest.lengthY; ++y) {
      if (sweeps.some(sweep => sweep.get(x, y, false))) {
        ++visible
      }
    }
  }
  console.log(visible)
}

function part2() {
  const forest = parseGrid()
  let bestDistance = 0
  for (let x = 0; x < forest.lengthX; ++x) {
    for (let y = 0; y < forest.lengthY; ++y) {
      const distances: number[] = []
      distances.push(scenicSweep(forest, [x, y], [0, 1]))
      distances.push(scenicSweep(forest, [x, y], [0, -1]))
      distances.push(scenicSweep(forest, [x, y], [1, 0]))
      distances.push(scenicSweep(forest, [x, y], [-1, 0]))
      const totalDistance = distances.reduce((total, dist) => total * dist, 1)
      if (bestDistance < totalDistance) {
        bestDistance = totalDistance
      }
    }
  }
  console.log(bestDistance)
}

part1()
part2()