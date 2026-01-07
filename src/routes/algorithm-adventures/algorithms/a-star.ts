import type { Graph, PathResult, FreeformNode } from '../pathfinding/components/constants';
import { euclideanDistance } from '../pathfinding/components/utils';

export function aStar(
  graph: Graph,
  startId: string,
  finishId: string,
  nodes: FreeformNode[]
): PathResult | null {
  // Build a map of node IDs to node objects for quick lookup
  const nodeMap = new Map<string, FreeformNode>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // Heuristic function: Euclidean distance between two nodes
  const heuristic = (nodeId: string, goalId: string): number => {
    const node = nodeMap.get(nodeId);
    const goal = nodeMap.get(goalId);
    if (!node || !goal) return 0;
    return euclideanDistance(node, goal);
  };

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const id of graph.keys()) {
    gScore.set(id, Infinity);
    fScore.set(id, Infinity);
    prev.set(id, null);
  }

  gScore.set(startId, 0);
  fScore.set(startId, heuristic(startId, finishId));

  const visitedOrder: string[] = [];

  // Get node with lowest fScore that hasn't been visited
  const getLowestFScore = () => {
    let best: string | null = null;
    let bestScore = Infinity;
    for (const [id, score] of fScore.entries()) {
      if (!visited.has(id) && score < bestScore) {
        bestScore = score;
        best = id;
      }
    }
    return best;
  };

  while (true) {
    const current = getLowestFScore();
    if (!current) break; // no more nodes to visit
    if (current === finishId) break; // reached the goal

    visited.add(current);
    visitedOrder.push(current);

    const neighbors = graph.get(current);
    if (!neighbors) continue;

    for (const [neighborId, weight] of neighbors.entries()) {
      if (visited.has(neighborId)) continue;

      const tentativeGScore = (gScore.get(current) ?? Infinity) + weight;

      if (tentativeGScore < (gScore.get(neighborId) ?? Infinity)) {
        prev.set(neighborId, current);
        gScore.set(neighborId, tentativeGScore);
        fScore.set(neighborId, tentativeGScore + heuristic(neighborId, finishId));
      }
    }
  }

  if ((gScore.get(finishId) ?? Infinity) === Infinity) {
    return null; // no path found
  }

  // Reconstruct the path
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
    totalCost: gScore.get(finishId) ?? Infinity
  };
}
