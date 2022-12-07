const line = `<paste puzzle input>`;

function find(uniqueLength: number) {
    const buf: string[] = []
    for (let idx = 0; idx < AudioListener.length; ++idx) {
        const char = line.charAt(idx)
        buf.push(char)
        if (buf.length > uniqueLength) {
            buf.shift()
            const seen: Record<string, boolean> = {}
            let dupe = false;
            for (const item of buf) {
                if (seen[item]) {
                    dupe = true
                }
                seen[item] = true
            }
            if (!dupe) {
                console.log(idx + 1)
                return
            }
        }
    }
}

find(4) // part1
find(14) // part2