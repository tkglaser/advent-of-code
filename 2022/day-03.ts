const lines = `<paste puzzle input>`.split("\n");

function priority(char: string): number {
    let result = char.charCodeAt(0) - "a".charCodeAt(0) + 1
    if (result < 0) {
        result = char.charCodeAt(0) - "A".charCodeAt(0) + 27
    }
    return result;
}

function getDuplicateType(line: string): string {
    let delta = 0;
    const seenFront: Record<string, boolean> = {}; const seenBack: Record<string, boolean> = {};
    while (delta < line.length / 2) {
        const charFront = line.charAt(delta);
        const charBack = line.charAt(line.length - 1 - delta);
        seenFront[charFront] = true; seenBack[charBack] = true;
        if (seenBack[charFront]) {
            return charFront;
        } else if (seenFront[charBack]) {
            return charBack;
        }
        ++delta;
    }
    throw `Dupe not found [${line}]`
}

function part1() {
    const sumPriorities = lines.reduce((total, line) => total + priority(getDuplicateType(line)), 0)
    console.log(`Total priorities[${sumPriorities}]`)
}

function getCommonType(lines: string[]): string {
    let delta = 0;
    const seen1: Record<string, boolean> = {}
    const seen2: Record<string, boolean> = {};
    const seen3: Record<string, boolean> = {};

    const common = (char: string) => char && seen1[char] && seen2[char] && seen3[char];
    while (true) {
        const char1 = lines[0].charAt(delta);
        const char2 = lines[1].charAt(delta);
        const char3 = lines[2].charAt(delta);

        seen1[char1] = true;
        seen2[char2] = true;
        seen3[char3] = true;

        if (common(char1)) { return char1 }
        if (common(char2)) { return char2 }
        if (common(char3)) { return char3 }
        ++delta;

    }
}
function part2() {
    let total = 0
    for (let idx = 0; idx < lines.length / 3; ++idx) {
        total += priority(getCommonType([lines[idx * 3], lines[idx * 3 + 1], lines[idx * 3 + 2]]))
    }
    console.log(`Total priorities [${total}]`)
}