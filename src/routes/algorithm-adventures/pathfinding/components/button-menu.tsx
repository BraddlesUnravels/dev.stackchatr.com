import { component$, type QRL } from '@builder.io/qwik';
import { AlgorithmButton, ButtonGroup } from './algorithm-button';

interface ButtonMenuProps {
  placeStartNode$?: QRL<() => void>;
  disableStartNode?: boolean;
  placeEndNode$?: QRL<() => void>;
  disableEndNode?: boolean;
  placeWalls$?: QRL<() => void>;
  placeNodes$?: QRL<() => void>;
  clearGrid$?: QRL<() => void>;
  runDijkstra$?: QRL<() => void>;
  runAStar$?: QRL<() => void>;
  showEdges$: QRL<() => void>;
}

export const Controller = component$<ButtonMenuProps>(
  ({
    placeStartNode$,
    disableStartNode,
    placeEndNode$,
    disableEndNode,
    placeWalls$,
    placeNodes$,
    clearGrid$,
    runDijkstra$,
    runAStar$,
    showEdges$
  }) => {
    return (
      <div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-2 backdrop-blur-sm">
        <ButtonGroup>
          <AlgorithmButton
            label="Place Start Node"
            onClick$={placeStartNode$}
            disabled={disableStartNode || false}
            position="first"
          />
          <AlgorithmButton
            label="Place End Node"
            onClick$={placeEndNode$}
            disabled={disableEndNode || false}
            position="middle"
          />
          <AlgorithmButton label="Place Walls" onClick$={placeWalls$} position="middle" />
          <AlgorithmButton label="Place Nodes" onClick$={placeNodes$} position="middle" />
          <AlgorithmButton label="Show Edges" onClick$={showEdges$} position="middle" />
          <AlgorithmButton label="Run Dijkstra's" onClick$={runDijkstra$} position="middle" />
          <AlgorithmButton label="Run A*" onClick$={runAStar$} position="middle" />
          <AlgorithmButton label="Clear Grid" onClick$={clearGrid$} position="last" />
        </ButtonGroup>
      </div>
    );
  }
);
