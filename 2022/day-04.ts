function isFullOverlap(line: string): boolean {
    const [a, b, x, y] = line.split(",").flatMap(pair => pair.split("-")).map(Number)
    return ((a >= x) && (b <= y)) || ((a <= x) && (b >= y))
}

function part1() {
    const totalOverlaps = lines.filter(isFullOverlap).length;
    console.log(totalOverlaps)
}

function isPartialOverlap(line: string): boolean {
    const [a, b, x, y] = line.split(",").flatMap(pair => pair.split("-")).map(Number)
    return !((b < x) || (a > y))
}

function part2() {
    const totalOverlaps = lines.filter(isPartialOverlap).length;
    console.log(totalOverlaps)
}
