import { component$ } from '@builder.io/qwik';
import type { FreeformNode, PathResult } from './constants';
import { findNeighbors, euclideanDistance } from './utils';

interface DebugPanelProps {
  placementMode: string;
  nodes: FreeformNode[];
  startNode: FreeformNode | null;
  finishNode: FreeformNode | null;
  result: PathResult | null;
  searchRadius: number;
}

export const DebugPanel = component$<DebugPanelProps>(
  ({ placementMode, nodes, startNode, finishNode, result, searchRadius }) => {
    return (
      <div class="absolute top-2 right-2 max-h-[80%] space-y-1 overflow-y-auto bg-black/90 backdrop-blur-sm p-3 text-xs rounded-lg">
        <div class="font-bold text-emerald-400">Distance Info</div>
        <div>Mode: {placementMode}</div>
        <div>Nodes: {nodes.length}</div>

        {startNode && (
          <div class="text-emerald-400">
            Start: ({startNode.x.toFixed(0)}, {startNode.y.toFixed(0)})
          </div>
        )}

        {finishNode && (
          <div class="text-rose-400">
            Finish: ({finishNode.x.toFixed(0)}, {finishNode.y.toFixed(0)})
          </div>
        )}

        {startNode && finishNode && (
          <div class="mt-2 font-bold text-amber-400">
            Euclidean: {euclideanDistance(startNode, finishNode).toFixed(3)}px
          </div>
        )}

        {result && (
          <div class="mt-2 text-xs text-amber-300">
            Path length: {result.path.length} nodes · Cost: {result.totalCost.toFixed(1)}
          </div>
        )}

        {nodes.length > 0 && (
          <div class="mt-2 border-t border-gray-700 pt-2">
            <p class="font-semibold">All Nodes:</p>
            {nodes.map((n) => {
              const neighbors = findNeighbors(n, nodes, searchRadius);
              return (
                <div key={n.id} class="mb-1 text-[10px]">
                  {n.type} - ({n.x.toFixed(0)}, {n.y.toFixed(0)})
                  <span class="text-gray-500"> [{neighbors.length} neighbors]</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
