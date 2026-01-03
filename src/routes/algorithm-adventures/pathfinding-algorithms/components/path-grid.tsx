import { component$, $, type QRL } from '@builder.io/qwik';
import type { Grid } from '~/utils/pathfinding/types';
import { PathNode } from './path-node';

interface PathGridProps {
  grid: Grid;
  onMouseDown$?: QRL<(row: number, col: number) => void>;
  onMouseEnter$?: QRL<(row: number, col: number) => void>;
  onMouseUp$?: QRL<(row: number, col: number) => void>;
  onMouseLeave$?: QRL<() => void>;
}

export const PathGrid = component$<PathGridProps>((props) => {
  const { grid } = props;

  return (
    <table class="mt-4 border-collapse" onMouseLeave$={props.onMouseLeave$}>
      <tbody class="grid">
        {grid.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((node) => (
              <PathNode
                key={`${node.row}-${node.col}`}
                row={node.row}
                col={node.col}
                isStart={node.isStart}
                isFinish={node.isFinish}
                isWall={node.isWall}
                isVisited={node.isVisited}
                isInShortestPath={!!node.isInShortestPath}
                onMouseDown$={$(() => props.onMouseDown$)}
                onMouseEnter$={$(() => props.onMouseEnter$)}
                onMouseUp$={$(() => props.onMouseUp$)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
