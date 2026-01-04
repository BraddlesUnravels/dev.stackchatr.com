import { $ } from '@builder.io/qwik';
import { DateTime } from 'luxon';
import type { FreeformNode } from './constants';

export const newNodeId = () => {
  return `node-${DateTime.now().toMillis()}`;
};

export const euclidianDistance = (node1: FreeformNode, node2: FreeformNode): number => {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const manhattanDistance = (nodes: FreeformNode[]): Map<string, Map<string, number>> => {
  const distanceMap = new Map<string, Map<string, number>>();

  nodes.forEach((nodeA) => {
    const distFromA = new Map<string, number>();
    nodes.forEach((nodeB) => {
      const distance = euclidianDistance(nodeA, nodeB);
      distFromA.set(nodeB.id, distance);
    });
    distanceMap.set(nodeA.id, distFromA);
  });
  console.log('Manhattan Distance Map:', JSON.stringify(distanceMap, null, 2));
  return distanceMap;
};

// find nieghbors within a certain radius
export const findNeighbors = (
  node: FreeformNode,
  allNodes: FreeformNode[],
  radius: number
): FreeformNode[] => {
  return allNodes.filter((otherNode) => {
    if (otherNode.id === node.id || otherNode.type === 'wall') return false;
    const distance = euclidianDistance(node, otherNode);
    return distance <= radius;
  });
};

export const buildDistanceMap = (nodes: FreeformNode[]): Map<string, Map<string, number>> => {
  const distanceMap = new Map<string, Map<string, number>>();
  nodes.forEach((node1) => {
    const distances = new Map<string, number>();
    nodes.forEach((node2) => {
      if (node1.id !== node2.id && node2.type !== 'wall') {
        const distance = euclidianDistance(node1, node2);
        distances.set(node2.id, distance);
      }
    });
    distanceMap.set(node1.id, distances);
  });

  return distanceMap;
};
