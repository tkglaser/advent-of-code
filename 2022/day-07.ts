const input = `<paste puzzle input>`.split("\n");

interface PuzzleItem {
    size: number;
};

class PuzzleFile implements PuzzleItem {
    constructor(public readonly name: string, public readonly size: number) { }
}

class PuzzleDir implements PuzzleItem {
    public readonly children: PuzzleItem[] = []
    private cachedSize = -1; // avoid repeated recalculation

    constructor(public readonly name: string, public readonly parent?: PuzzleDir) { }

    add(item: PuzzleItem) {
        this.invalidateSizeCache()
        this.children.push(item)
    }

    getSubDir(name: string): PuzzleDir {
        return this.children.find(
            item => item instanceof PuzzleDir && item.name === name
        ) as PuzzleDir;
    }

    get size() {
        if (this.cachedSize === -1) {
            this.cachedSize = this.children.reduce((total, item) => total + item.size, 0)
        }
        return this.cachedSize
    }

    private invalidateSizeCache() {
        this.cachedSize = -1;
        this.parent?.invalidateSizeCache();
    }
}

function isDir(item: PuzzleItem): item is PuzzleDir {
    return item instanceof PuzzleDir;
}

function buildTree() {
    let currentDir!: PuzzleDir;

    for (const line of input) {
        const lineTokens = line.split(" ");
        if (lineTokens[0] === "$") {
            // command
            if (lineTokens[1] === "cd") {
                if (lineTokens[2] === "/") {
                    // create root
                    currentDir = new PuzzleDir("/");
                } else if (lineTokens[2] === "..") {
                    currentDir = currentDir.parent!;
                } else {
                    currentDir = currentDir.getSubDir(lineTokens[2])
                }
            }
        } else if (!Number.isNaN(+lineTokens[0])) {
            currentDir.add(new PuzzleFile(lineTokens[1], +lineTokens[0]))
        } else if (lineTokens[0] === "dir") {
            currentDir.add(new PuzzleDir(lineTokens[1], currentDir))
        }
    }

    while (currentDir.parent) currentDir = currentDir.parent;
    return currentDir;
}

function traverse(tree: PuzzleDir, visit: (item: PuzzleItem) => void) {
    const traverser = (node: PuzzleItem) => {
        visit(node);
        if (isDir(node)) {
            for (const child of node.children) {
                traverser(child)
            }
        }
    }
    traverser(tree)
}

function part1(tree: PuzzleDir) {
    let sumSizes = 0;
    traverse(tree, (node) => {
        if (isDir(node) && node.size <= 100000) {
            sumSizes += node.size;
        }
    })
    console.log(`Sum of sizes: [${sumSizes}]`)
}

const totalSpaceAvailable = 70000000;
const spaceNeeded = 30000000;

function part2(tree: PuzzleDir) {
    const spaceUsed = tree.size;
    const spaceToFree = spaceUsed + spaceNeeded - totalSpaceAvailable;
    let bestDirSeen!: PuzzleDir;

    traverse(tree, (node) => {
        if (isDir(node) && node.size >= spaceToFree) {
            if (node.size < (bestDirSeen?.size ?? Number.MAX_VALUE)) {
                bestDirSeen = node
            }
        }
    })
    console.log(`Best Dir is [${bestDirSeen.name}] with [${bestDirSeen.size}]`)
}

const directoryTree = buildTree()
part1(directoryTree)
part2(directoryTree)