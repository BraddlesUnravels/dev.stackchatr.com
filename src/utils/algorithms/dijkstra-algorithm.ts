type Edge = [to: number, weight: number];
export type AdjacencyList = Edge[][];

class MinPriorityQueue {
  private heap: [distance: number, node: number][] = [];

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  push(item: [number, number]): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): [number, number] | undefined {
    if (this.heap.length === 0) return;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent][0] <= this.heap[index][0]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  private bubbleDown(index: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < n && this.heap[left][0] < this.heap[smallest][0]) {
        smallest = left;
      }
      if (right < n && this.heap[right][0] < this.heap[smallest][0]) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}

export interface DijkstraResult {
  distances: number[];
  previous: (number | null)[];
}

/**
 * Dijkstra's algorithm for single‑source shortest paths on a graph with
 * non‑negative edge weights.
 *
 * @param adj   Adjacency list where adj[u] = array of [v, weight] edges
 * @param src   Source vertex index
 * @returns     DijkstraResult containing the shortest distances from src to every vertex
 *              and the previous vertex on the shortest path for each vertex.
 */
export function dijkstra(adj: AdjacencyList, src: number): DijkstraResult {
  const V = adj.length;
  if (src < 0 || src >= V) {
    throw new RangeError(`Source vertex ${src} is out of bounds (0..${V - 1})`);
  }

  const dist = Array<number>(V).fill(Infinity);
  const previous = Array<number | null>(V).fill(null);
  const pq = new MinPriorityQueue();

  dist[src] = 0;
  pq.push([0, src]);

  while (!pq.isEmpty()) {
    const item = pq.pop();
    if (!item) break;

    const [d, u] = item;

    // If this is an outdated distance, skip it
    if (d > dist[u]) continue;

    for (const [v, w] of adj[u]) {
      const alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        previous[v] = u;
        pq.push([alt, v]);
      }
    }
  }

  return { distances: dist, previous };
}
