export interface Vertex {
    id: string;
    equals(that: Vertex): boolean;
    toString(): string;
  }
  
  export interface Edge<V extends Vertex = Vertex> {
    source: V;
    target: V;
    distance: number;
  }
  
  export interface Graph {
    vertices: Vertex[];
    getVertex(id: string): Vertex;
    adjacentEdges(node: Vertex): Edge[];
  }
  