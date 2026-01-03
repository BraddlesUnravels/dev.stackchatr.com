import { component$, $, type QRL, type Signal } from '@builder.io/qwik';
import { Button } from '~/components/ui';

interface ButtonMenuProps {
  clearGrid$: QRL<() => void>;
  clearWalls$: QRL<() => void>;
  clearAllAndReset$: QRL<() => void>;
  runDijkstra$: QRL<() => void>;
  runAStar$: QRL<() => void>;
  runBfs$: QRL<() => void>;
  runDfs$: QRL<() => void>;
  isDesktopViewSig: Signal<boolean>;
  toggleView$: QRL<() => void>;
}

export const OptionsMenu = component$<ButtonMenuProps>(
  ({
    clearGrid$,
    clearWalls$,
    clearAllAndReset$,
    runDijkstra$,
    runAStar$,
    runBfs$,
    runDfs$,
    isDesktopViewSig,
    toggleView$
  }) => {
    return (
      <div class="flex flex-wrap gap-2">
        <Button label="Clear Grid" type="button" onClick$={clearGrid$} />

        <Button label="Clear Walls" type="button" onClick$={clearWalls$} />
        <Button
          label="Reset Start/Finish & Grid"
          type="button"
          onClick$={clearAllAndReset$}
        />
        <Button label="Run Dijkstra's" type="button" onClick$={runDijkstra$} />
        <Button label="Run A*" type="button" onClick$={runAStar$} />
        <Button
          label="Run Breadth First Search (BFS)"
          type="button"
          onClick$={runBfs$}
        />
        <Button
          label="Run Depth First Search (DFS)"
          type="button"
          onClick$={runDfs$}
        />
        <Button
          label={isDesktopViewSig.value ? 'Mobile View' : 'Desktop View'}
          type="button"
          onClick$={toggleView$}
        />
      </div>
    );
  }
);
