import { component$, $, type QRL } from '@builder.io/qwik';

interface PathNodeProps {
  row: number;
  col: number;
  isStart: boolean;
  isFinish: boolean;
  isWall: boolean;
  isVisited: boolean;
  isInShortestPath: boolean;
  onMouseDown$?: QRL<(row: number, col: number) => void>;
  onMouseEnter$?: QRL<(row: number, col: number) => void>;
  onMouseUp$?: QRL<(row: number, col: number) => void>;
}

export const PathNode = component$<PathNodeProps>((props) => {
  const { row, col, isStart, isFinish, isWall, isVisited, isInShortestPath } =
    props;

  let stateClass = '';
  if (isStart) stateClass = 'bg-emerald-500';
  else if (isFinish) stateClass = 'bg-rose-500';
  else if (isWall) stateClass = 'bg-slate-900';
  else if (isInShortestPath) stateClass = 'bg-amber-400';
  else if (isVisited) stateClass = 'bg-emerald-900/70';

  const onEnterExists =
    !!props.onMouseEnter$ && !!props.onMouseDown$ && !!props.onMouseUp$;

  return (
    <td
      id={`node-${row}-${col}`}
      class="p-0"
      onMouseDown$={
        props?.onMouseDown$ && $(() => props?.onMouseDown$!(row, col))
      }
      onMouseEnter$={
        props?.onMouseEnter$ && $(() => props?.onMouseEnter$!(row, col))
      }
      onMouseUp$={props?.onMouseUp$ && $(() => props?.onMouseUp$!(row, col))}
    >
      <div
        class={`h-5 w-5 border border-emerald-500/30 transition-colors duration-150 ${stateClass}`}
      />
    </td>
  );
});
