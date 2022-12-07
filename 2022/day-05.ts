const lines = `<paste puzzle input>`.split("\n");

function splitInput(lines: string[]) {
    const setup: string[] = []
    const moves: string[] = []
    let setupDone = false
    for (const line of lines) {
        if (line === "") {
            setupDone = true
        }
        else if (!setupDone) {
            setup.push(line)
        } else {
            moves.push(line)
        }
    }
    return { setup, moves }
}

function parseInitial(lines: string[]) {
    const linesReversed = lines.reverse();
    const stacks: string[][] = [];

    const numberOfStacks = ((linesReversed[0].length + 1) / 4)

    for (let idx = 1; idx < linesReversed.length; ++idx) {
        for (let sidx = 0; sidx < numberOfStacks; ++sidx) {
            if (!stacks[sidx]) stacks[sidx] = [];
            const strIdx = 1 + 4 * sidx;
            const char = linesReversed[idx].charAt(strIdx);
            if (char !== " ") {
                stacks[sidx].push(char)
            }
        }
    }
    return stacks
}

function runMoves9000(stacks: string[][], lines: string[]) {
    for (const line of lines) {
        const [, moveCount, , start, , target] = line.split(" ");
        let ctr = +moveCount;
        do {
            const item = stacks[+start - 1].pop()
            stacks[+target - 1].push(item!)
            --ctr
        } while (ctr)
    }
}

function runMoves9001(stacks: string[][], lines: string[]) {
    for (const line of lines) {
        const [, moveCount, , start, , target] = line.split(" ");
        let ctr = +moveCount;
        let items: string[] = []
        do {
            items.push(stacks[+start - 1].pop()!)
            --ctr
        } while (ctr)
        stacks[+target - 1].push(...items.reverse())
    }
}

function topItems(stacks: string[][]) {
    return stacks.map(stack => stack.pop()).join("")
}

function part1() {
    const chunks = splitInput(lines);
    const stacks = parseInitial(chunks.setup)
    runMoves9000(stacks, chunks.moves)
    console.log(topItems(stacks))
}

function part2() {
    const chunks = splitInput(lines);
    const stacks = parseInitial(chunks.setup)
    runMoves9001(stacks, chunks.moves)
    console.log(topItems(stacks))
}