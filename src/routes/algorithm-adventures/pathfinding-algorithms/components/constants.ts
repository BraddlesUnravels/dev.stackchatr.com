export type NodeType = 'start' | 'finish' | 'wall' | 'visited' | 'path' | 'normal';

export interface FreeformNode {
  id: string;
  x: number; // pixels
  y: number; // pixels
  type: NodeType;
}
