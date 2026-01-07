export type NodeType = 'start' | 'finish' | 'wall' | 'visited' | 'path' | 'normal';

export interface FreeformNode {
  id: string;
  x: number; // pixels
  y: number; // pixels
  type: NodeType;
}

export type Graph = Map<string, Map<string, number>>;

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphData {
  nodes: FreeformNode[];
  edges: Edge[];
}

export interface PathResult {
  path: string[]; // Node IDs in order from start to finish
  visitedOrder: string[]; // All nodes visited in order (for animation)
  totalCost: number;
}

// Animation and interaction constants
export const ANIMATION_STEP_DELAY = 150; // ms between animation steps
export const MIN_NODE_DISTANCE = 20; // minimum distance between nodes in pixels
export const SEARCH_RADIUS = 350; // neighbor search radius in pixels
export const WALL_RADIUS = 25; // wall collision radius in pixels
export const CONTAINER_PADDING = 10; // padding from container edges in pixels

