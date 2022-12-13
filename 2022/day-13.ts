const input = `<input, leave blank line at the end>

`.split("\n");

type PacketItem = number | PacketItem[];
type Packet = PacketItem[];
type PacketPair = [Packet, Packet];
const enum CompareResult {
  Less,
  Equal,
  Greater,
}

function parseInput() {
  let pairs: PacketPair[] = [];
  let currentPair: Packet[] = [];
  for (const line of input) {
    if (line) {
      currentPair.push(JSON.parse(line));
    } else {
      pairs.push(currentPair as PacketPair);
      currentPair = [];
    }
  }

  return pairs;
}

function compareItems(left: PacketItem, right: PacketItem): CompareResult {
  //   console.log("Input", left, right);
  if (typeof left === "undefined" && typeof right === "undefined") {
    return CompareResult.Equal;
  }
  if (typeof left === "undefined") {
    return CompareResult.Less;
  }
  if (typeof right === "undefined") {
    return CompareResult.Greater;
  }
  if (typeof left === "number" && typeof right === "number") {
    if (left === right) {
      return CompareResult.Equal;
    }
    if (left < right) {
      return CompareResult.Less;
    }
    return CompareResult.Greater;
  }
  if (typeof left === "number") {
    return compareItems([left], right);
  }
  if (typeof right === "number") {
    return compareItems(left, [right]);
  }
  // both are arrays at this point
  if (left.length === 0 && right.length === 0) {
    return CompareResult.Equal;
  }
  if (left.length === 0) {
    return CompareResult.Less;
  }
  if (right.length === 0) {
    return CompareResult.Greater;
  }
  const [leftHead, ...leftRest] = left;
  const [rightHead, ...rightRest] = right;
  let result = compareItems(leftHead, rightHead);
  if (result !== CompareResult.Equal) {
    return result;
  }
  return compareItems(leftRest, rightRest);
}

const parsedInput = parseInput();

function part1() {
  let idxSum = 0;
  parsedInput.forEach((pair, idx) => {
    if (compareItems(pair[0], pair[1]) === CompareResult.Less) {
      idxSum += idx + 1;
    }
  });
  console.log(idxSum);
}

function part2() {
  // full sort not needed, just count the items smaller than the dividers
  let divider1 = [[2]];
  let divider2 = [[6]];
  let smallerThan1 = 0;
  let smallerThan2 = 0;
  for (const pair of parsedInput.flatMap((pair) => pair)) {
    if (compareItems(pair, divider1) === CompareResult.Less) {
      ++smallerThan1;
    }
    if (compareItems(pair, divider2) === CompareResult.Less) {
      ++smallerThan2;
    }
  }

  console.log(
    smallerThan1 + 1,
    smallerThan2 + 2,
    (smallerThan1 + 1) * (smallerThan2 + 2)
  );
}

part1();
part2();
