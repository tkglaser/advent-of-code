function part1() {
    let elf = 1;
    let elfCals = 0;
    let bestElf = 1;
    let bestElfCals = 0;
    for (const line of lines) {
        if (line === "") {
            ++elf;
            elfCals = 0;
        } else {
            elfCals = elfCals + +line;
            if (elfCals > bestElfCals) {
                bestElfCals = elfCals;
                bestElf = elf;
            }
        }
    }
    console.log(`Best Elf is ${bestElf} carrying ${bestElfCals}`)
}
function part2() {
    let elf = 1;
    let elfCals = 0;
    let bestElfs: number[] = [];
    let bestElfCals: number[] = [];

    for (const line of lines) {
        if (line === "") {
            bestElfs.push(elf);
            bestElfCals.push(elfCals);

            if (bestElfCals.length > 3) {
                // evict the lowest
                let lowestIdx = 0;
                let lowestVal = Number.MAX_SAFE_INTEGER;
                bestElfCals.forEach((val, idx) => {
                    if (val < lowestVal) {
                        lowestVal = val;
                        lowestIdx = idx;
                    }
                })
                bestElfs.splice(lowestIdx, 1)
                bestElfCals.splice(lowestIdx, 1)
            }
            ++elf;
            elfCals = 0;
        } else {
            elfCals = elfCals + +line;
        }
    }
    console.log(`The top three elfs are carrying [${bestElfCals.reduce((total, curr) => total + curr, 0)}]`)
}