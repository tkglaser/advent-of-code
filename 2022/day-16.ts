import { Vertex } from "./utils/graph/models";
import { Path } from "./utils/graph/path";
import { SimpleGraph } from "./utils/graph/simple-graph";

const input = `< input >`.split("\n");

class Valve implements Vertex {
  constructor(readonly id: string, readonly flowRate: number) {}

  toString(): string {
    return `[${this.id}](${this.flowRate})`;
  }

  equals(that: Vertex) {
    return this.id === that.id;
  }
}

type TunnelMap = SimpleGraph<Valve>;

function parseInput() {
  const tunnels = new SimpleGraph<Valve>();
  const distancesMap = new SimpleGraph<Valve>();

  const tokeniseLine = (line: string) =>
    line
      .split("Valve ")
      .flatMap((tok) => tok.split(" has flow rate="))
      .flatMap((tok) => tok.split("; tunnels lead to valves "))
      .flatMap((tok) => tok.split("; tunnel leads to valve "))
      .flatMap((tok) => tok.split(","))
      .filter(Boolean)
      .map((tok) => tok.trim());

  for (const line of input) {
    const [source, flowRate] = tokeniseLine(line);
    tunnels.addVertex(new Valve(source, +flowRate));
  }

  for (const line of input) {
    const [source, , ...targets] = tokeniseLine(line);
    for (const target of targets) {
      tunnels.addEdge({
        source: tunnels.getVertex(source),
        target: tunnels.getVertex(target),
        distance: 1,
      });
    }
  }

  distancesMap.addVertex(tunnels.getVertex("AA"));

  for (const tunnelVertex of tunnels.vertices.filter(
    (v) => v.id !== "AA" && v.flowRate > 0
  )) {
    distancesMap.addVertex(tunnelVertex);
    for (const existingVertex of distancesMap.vertices.filter(
      (v) => !v.equals(tunnelVertex)
    )) {
      const distance = tunnels.shortestPathLength(tunnelVertex, existingVertex);
      if (distance < Number.MAX_SAFE_INTEGER) {
        distancesMap.addEdge({
          source: tunnelVertex,
          target: existingVertex,
          distance,
        });
        distancesMap.addEdge({
          source: existingVertex,
          target: tunnelVertex,
          distance,
        });
      }
    }
  }

  console.log(distancesMap.toString());

  return distancesMap;
}

function scorePath(valvesPath: Path<Valve>) {
  let flowRate = 0;
  let pressureReleased = 0;
  const edges = [...valvesPath.edges];
  let time = 0;
  do {
    const currentEdge = edges.shift();
    if (!currentEdge) {
      break;
    }
    time += currentEdge.distance + 1;
    pressureReleased += (currentEdge.distance + 1) * flowRate;
    flowRate += currentEdge.target.flowRate;
  } while (true);

  // add the remaining time
  if (time > 30) {
    return -1; // invalid solution
  }

  const additionalPressureReleased = (30 - time) * flowRate;

  return pressureReleased + additionalPressureReleased;
}

function part1(tunnels: TunnelMap) {
  let bestScore = Number.MIN_VALUE;
  let bestPath: Path<Valve>;
  tunnels.dfsTraverser(tunnels.getVertex("AA"), (path) => {
    if (path.length > 30) {
      return {
        abortPath: true,
      };
    }
    const score = scorePath(path);
    if (score > bestScore) {
      bestScore = score;
      bestPath = path;
      console.log(bestScore, bestPath!.toString());
    }
    return {};
  });
  console.log(bestScore, bestPath!.toString());
}

const distanceMap = parseInput();

// const [aa, bb, cc, dd, ee, ff, gg, hh, ii, jj] = [
//   "AA",
//   "BB",
//   "CC",
//   "DD",
//   "EE",
//   "FF",
//   "GG",
//   "HH",
//   "II",
//   "JJ",
// ].map((id) => distanceMap.getVertex(id));

// const s = scorePath(
//   Path.start(aa)
//     .go(distanceMap.getEdge(aa, dd))
//     .go(distanceMap.getEdge(dd, bb))
//     .go(distanceMap.getEdge(bb, jj))
//     .go(distanceMap.getEdge(jj, hh))
//     .go(distanceMap.getEdge(hh, ee))
//     .go(distanceMap.getEdge(ee, cc))
// );

// console.log(s)
part1(distanceMap);
