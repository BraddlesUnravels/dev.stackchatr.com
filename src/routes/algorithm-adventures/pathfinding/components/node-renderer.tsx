import { component$, type QRL } from '@builder.io/qwik';
import type { FreeformNode, NodeType } from './constants';

interface NodeRendererProps {
  nodes: FreeformNode[];
  onMouseDown$: QRL<(e: MouseEvent, nodeId: string) => void>;
  onContextMenu$: QRL<(e: MouseEvent, nodeId: string) => void>;
}

const getNodeStyle = (node: FreeformNode): string => {
  const baseColors: Record<NodeType, string> = {
    start: 'bg-emerald-500 opacity-90',
    finish: 'bg-rose-500 opacity-90',
    wall: 'bg-slate-700 border-2 border-slate-500 opacity-80',
    visited: 'bg-blue-500 opacity-80',
    path: 'bg-amber-400 opacity-90',
    normal: 'bg-gray-400 opacity-70'
  };

  return baseColors[node.type];
};

export const NodeRenderer = component$<NodeRendererProps>(
  ({ nodes, onMouseDown$, onContextMenu$ }) => {
    return (
      <>
        {nodes.map((node) => {
          const isWall = node.type === 'wall';
          const size = isWall ? 'h-10 w-10' : 'h-5 w-5';
          const shape = isWall ? 'rounded-md' : 'rounded-full';

          return (
            <div
              key={node.id}
              class={`absolute ${size} cursor-move ${shape} ${getNodeStyle(node)} transition-all duration-200`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseDown$={(e) => onMouseDown$(e, node.id)}
              onContextMenu$={(e) => onContextMenu$(e, node.id)}
              title={`${node.type} (${node.x.toFixed(0)}, ${node.y.toFixed(0)})`}
            />
          );
        })}
      </>
    );
  }
);
