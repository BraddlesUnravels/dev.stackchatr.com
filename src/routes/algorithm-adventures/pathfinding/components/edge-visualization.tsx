import { component$ } from '@builder.io/qwik';
import type { FreeformNode } from './constants';
import { findNeighbors } from './utils';

interface EdgeVisualizationProps {
  nodes: FreeformNode[];
  searchRadius: number;
  show: boolean;
}

export const EdgeVisualization = component$<EdgeVisualizationProps>(
  ({ nodes, searchRadius, show }) => {
    if (!show) return null;

    return (
      <svg class="pointer-events-none absolute inset-0" style="width: 100%; height: 100%;">
        {nodes.map((node) => {
          if (node.type === 'wall') return null;
          const neighbors = findNeighbors(node, nodes, searchRadius);
          return neighbors.map((neighbor: FreeformNode) => (
            <line
              key={`${node.id}-${neighbor.id}`}
              x1={node.x}
              y1={node.y}
              x2={neighbor.x}
              y2={neighbor.y}
              stroke="rgba(34, 197, 94, 0.2)"
              stroke-width="1"
            />
          ));
        })}
      </svg>
    );
  }
);
