import type { GridNode } from './types';

export type AnimationStep =
  | { type: 'visit'; row: number; col: number }
  | { type: 'path'; row: number; col: number }
  | { type: 'done' };

export function getNodesInShortestPathOrder(finishNode: GridNode): GridNode[] {
  const nodesInShortestPathOrder: GridNode[] = [];
  let currentNode: GridNode | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

export function buildAnimationSteps(
  visitedNodesInOrder: GridNode[],
  nodesInShortestPathOrder: GridNode[]
): AnimationStep[] {
  const steps: AnimationStep[] = [];

  for (const node of visitedNodesInOrder) {
    if (!node.isStart && !node.isFinish) {
      steps.push({ type: 'visit', row: node.row, col: node.col });
    }
  }

  for (const node of nodesInShortestPathOrder) {
    if (!node.isStart && !node.isFinish) {
      steps.push({ type: 'path', row: node.row, col: node.col });
    }
  }

  steps.push({ type: 'done' });

  return steps;
}
