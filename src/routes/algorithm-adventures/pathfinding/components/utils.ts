import { DateTime } from 'luxon';
import type { FreeformNode, Graph, NodeType } from './constants';

export function newNodeId(): string {
  return `node-${DateTime.now().toMillis()}`;
}

export function euclideanDistance(node1: FreeformNode, node2: FreeformNode): number {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function manhattanDistance(nodes: FreeformNode[]): Map<string, Map<string, number>> {
  const distanceMap = new Map<string, Map<string, number>>();

  nodes.forEach((nodeA) => {
    const distFromA = new Map<string, number>();
    nodes.forEach((nodeB) => {
      const distance = euclideanDistance(nodeA, nodeB);
      distFromA.set(nodeB.id, distance);
    });
    distanceMap.set(nodeA.id, distFromA);
  });
  return distanceMap;
}

// find nieghbors within a certain radius
export function findNeighbors(
  node: FreeformNode,
  allNodes: FreeformNode[],
  radius: number
): FreeformNode[] {
  return allNodes.filter((otherNode) => {
    if (otherNode.id === node.id || otherNode.type === 'wall') return false;
    const distance = euclideanDistance(node, otherNode);
    return distance <= radius;
  });
}

// Check if a line segment from p1 to p2 passes too close to a wall
function lineIntersectsWall(
  p1: FreeformNode,
  p2: FreeformNode,
  wall: FreeformNode,
  wallRadius: number = 25
): boolean {
  // Calculate the closest point on the line segment to the wall
  const x1 = p1.x;
  const y1 = p1.y;
  const x2 = p2.x;
  const y2 = p2.y;
  const wx = wall.x;
  const wy = wall.y;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    // p1 and p2 are the same point
    const dist = Math.sqrt((wx - x1) * (wx - x1) + (wy - y1) * (wy - y1));
    return dist < wallRadius;
  }

  // Parameter t represents the closest point on the line segment
  let t = ((wx - x1) * dx + (wy - y1) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t)); // Clamp to [0,1] to stay on segment

  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  const distance = Math.sqrt((wx - closestX) * (wx - closestX) + (wy - closestY) * (wy - closestY));
  return distance < wallRadius;
}

export function buildDistanceMap(
  nodes: FreeformNode[],
  radius: number
): Map<string, Map<string, number>> {
  const distanceMap = new Map<string, Map<string, number>>();
  const walls = nodes.filter((n) => n.type === 'wall');

  nodes.forEach((node1) => {
    if (node1.type === 'wall') return;

    const distances = new Map<string, number>();
    const neighbors = findNeighbors(node1, nodes, radius);
    neighbors.forEach((node2) => {
      if (node1.id !== node2.id && node2.type !== 'wall') {
        // Check if any wall blocks this connection
        const isBlocked = walls.some((wall) => lineIntersectsWall(node1, node2, wall));

        if (!isBlocked) {
          const distance = euclideanDistance(node1, node2);
          distances.set(node2.id, distance);
        }
      }
    });
    distanceMap.set(node1.id, distances);
  });

  return distanceMap;
}

// Clamp coordinates within container bounds
export function clampCoordinates(
  x: number,
  y: number,
  bounds: { width: number; height: number },
  padding: number = 10
): { x: number; y: number } {
  return {
    x: Math.max(padding, Math.min(x, bounds.width - padding)),
    y: Math.max(padding, Math.min(y, bounds.height - padding))
  };
}

// Check if a point is too close to any existing node
export function isNodeTooClose(
  x: number,
  y: number,
  nodes: FreeformNode[],
  minDistance: number = 20
): boolean {
  return nodes.some((n) => {
    const dx = n.x - x;
    const dy = n.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < minDistance;
  });
}

// Get mouse position relative to container
export function getRelativeMousePosition(
  e: MouseEvent,
  container: HTMLElement
): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// Update a specific node's type
export function updateNodeType(
  nodes: FreeformNode[],
  nodeId: string,
  newType: NodeType
): FreeformNode[] {
  return nodes.map((n) => (n.id === nodeId ? { ...n, type: newType } : n));
}

// Remove all nodes of a specific type
export function removeNodeByType(nodes: FreeformNode[], type: NodeType): FreeformNode[] {
  return nodes.filter((n) => n.type !== type);
}

// Reset all node types except start/finish/wall
export function resetNodeStates(nodes: FreeformNode[]): FreeformNode[] {
  return nodes.map((n) => {
    if (n.type === 'start' || n.type === 'finish' || n.type === 'wall') return n;
    return { ...n, type: 'normal' };
  });
}

