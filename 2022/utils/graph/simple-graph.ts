import { Edge, Graph, Vertex } from "./models";
import { Path } from "./path";

export type VisitorFunction<V extends Vertex = Vertex> = (path: Path<V>) => {
  abortPath?: boolean;
  abortTraversal?: boolean;
};

export class SimpleGraph<
  V extends Vertex = Vertex,
  E extends Edge<V> = Edge<V>
> {
  #vertices: Record<string, V> = {};
  #edges: E[] = [];

  get vertices() {
    return Object.values(this.#vertices);
  }

  getVertex(id: string): V {
    return this.#vertices[id];
  }

  getEdge(a: V, b: V): E {
    return this.#edges.find((e) => e.source.equals(a) && e.target.equals(b))!;
  }

  addVertex(vertex: V) {
    this.#vertices[vertex.id] = vertex;
  }

  addEdge(edge: E) {
    this.#edges.push(edge);
    this.#vertices[edge.source.id] = edge.source;
    this.#vertices[edge.target.id] = edge.target;
  }

  toString() {
    let output = "";
    output += this.vertices.map((v) => v.toString()).join(",") + `\n`;
    output += this.#edges
      .map(
        ({ source, target, distance }) =>
          `${source.id} =[${distance}]=> ${target.id}`
      )
      .join("\n");
    return output;
  }

  adjacentEdges(vertex: V) {
    return this.#edges.filter((e) => e.source.equals(vertex)) as E[];
  }

  shortestPathLength(start: V, target: V) {
    let distance = Number.MAX_SAFE_INTEGER;

    this.bfsTraverser(start, (path) => {
      if (path.end.equals(target)) {
        distance = path.length;
        return {
          abortTraversal: true,
        };
      }
      return {};
    });

    return distance;
  }

  bfsTraverser(start: V, visit: VisitorFunction<V>) {
    const verticesToInspect: Path<V, E>[] = [Path.start<V, E>(start)];
    const seen: Record<string, boolean> = {};

    seen[start.id] = true;

    while (verticesToInspect.length) {
      const v = verticesToInspect.shift()!;
      const { abortPath, abortTraversal } = visit(v);
      if (abortTraversal) {
        return;
      }
      if (!abortPath) {
        for (const adjEdge of this.adjacentEdges(v.end)) {
          if (!seen[adjEdge.target.id]) {
            seen[adjEdge.target.id] = true;
            verticesToInspect.push(v.go(adjEdge));
          }
        }
      }
    }
  }

  dfsTraverser(start: V, visit: VisitorFunction<V>) {
    const verticesToInspect: Path<V, E>[] = [Path.start<V, E>(start)];

    while (verticesToInspect.length) {
      const v = verticesToInspect.pop()!;
      const { abortPath, abortTraversal } = visit(v);
      if (abortTraversal) {
        return;
      }
      if (!abortPath) {
        for (const adjVertex of this.adjacentEdges(v.end)) {
          if (!v.visited(adjVertex.target)) {
            verticesToInspect.push(v.go(adjVertex));
          }
        }
      }
    }
  }
}
