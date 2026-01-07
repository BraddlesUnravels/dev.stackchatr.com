import type { Graph, PathResult } from '../pathfinding/components/constants';

export function dijkstra(graph: Graph, startId: string, finishId: string): PathResult | null {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const id of graph.keys()) {
    dist.set(id, Infinity);
    prev.set(id, null);
  }
  dist.set(startId, 0);

  const visitedOrder: string[] = [];

  const getClosestUnvisited = () => {
    let best: string | null = null;
    let bestDist = Infinity;
    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < bestDist) {
        bestDist = d;
        best = id;
      }
    }
    return best;
  };

  while (true) {
    const current = getClosestUnvisited();
    if (!current) break; // remaining are unreachable
    if (current === finishId) break; // done

    visited.add(current);
    visitedOrder.push(current);

    const neighbors = graph.get(current);
    if (!neighbors) continue;

    for (const [neighborId, weight] of neighbors.entries()) {
      if (visited.has(neighborId)) continue;

      const alt = (dist.get(current) ?? Infinity) + weight;
      if (alt < (dist.get(neighborId) ?? Infinity)) {
        dist.set(neighborId, alt);
        prev.set(neighborId, current);
      }
    }
  }

  if ((dist.get(finishId) ?? Infinity) === Infinity) {
    return null; // no path
  }

  // reconstruct path
  const path: string[] = [];
  let cur: string | null = finishId;
  while (cur) {
    path.push(cur);
    cur = prev.get(cur) ?? null;
  }
  path.reverse();

  return {
    path,
    visitedOrder,
    totalCost: dist.get(finishId) ?? Infinity
  };
}
