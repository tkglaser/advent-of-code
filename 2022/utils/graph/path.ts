import { Edge, Vertex } from "./models";

export class Path<V extends Vertex = Vertex, E extends Edge<V> = Edge<V>> {
  #visited: Record<string, boolean> = {};

  private constructor(
    private readonly _start: V,
    private readonly _edges: ReadonlyArray<E>
  ) {
    for (const v of _edges) {
      this.#visited[v.source.id] = true;
      this.#visited[v.target.id] = true;
    }
  }

  static start<V extends Vertex = Vertex, E extends Edge<V> = Edge<V>>(v: V) {
    return new Path<V, E>(v, []);
  }

  get edges() {
    return this._edges;
  }

  get vertices() {
    return [this._start, ...this.edges.map((e) => e.target)];
  }

  get length() {
    return this.edges.reduce((total, e) => (total += e.distance), 0);
  }

  get end() {
    return this._edges[this._edges.length - 1]?.target ?? this._start;
  }

  visited(v: V) {
    return !!this.#visited[v.id];
  }

  go(edge: E) {
    return new Path(this._start, [...this.edges, edge]);
  }

  get canBacktrack() {
    return !!this.edges.length;
  }

  backtrack() {
    const edgesCopy = [...this.edges];
    edgesCopy.pop();
    return new Path(this._start, edgesCopy);
  }

  toString() {
    return this.vertices.map((v) => v.toString()).join(" => ");
  }
}
