import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { PageBaseContainer } from '~/components/layout/lib';
import type { AlgorithmName, Coord, Grid } from '~/utils/pathfinding/types';
import {
  createGrid,
  toggleWall,
  resetGridState,
  clearWalls,
  gridHasVisitedOrPath
} from '~/utils/pathfinding/grid';
import { dijkstra } from '~/utils/pathfinding/algorithms/dijkstra';
import { aStar } from '~/utils/pathfinding/algorithms/a-star';
import { bfs } from '~/utils/pathfinding/algorithms/bfs';
import { dfs } from '~/utils/pathfinding/algorithms/dfs';
import {
  buildAnimationSteps,
  getNodesInShortestPathOrder,
  type AnimationStep
} from '~/utils/pathfinding/animation';
import { PathGrid } from './components/path-grid';
import { OptionsMenu } from './components/button-menu';

const DESKTOP_ROWS = 20;
const DESKTOP_COLS = 30;
const MOBILE_ROWS = 10;
const MOBILE_COLS = 20;

const INITIAL_START: Coord = { row: 5, col: 5 };
const INITIAL_FINISH: Coord = { row: 5, col: 15 };

export default component$(() => {
  const gridSig = useSignal<Grid>(
    createGrid({
      rowCount: DESKTOP_ROWS,
      colCount: DESKTOP_COLS,
      start: INITIAL_START,
      finish: INITIAL_FINISH
    })
  );

  const startSig = useSignal<Coord>({ ...INITIAL_START });
  const finishSig = useSignal<Coord>({ ...INITIAL_FINISH });

  const isRunningSig = useSignal(false);
  const isDesktopViewSig = useSignal(true);

  const mouseIsPressedSig = useSignal(false);
  const modeSig = useSignal<
    'idle' | 'drag-start' | 'drag-finish' | 'draw-walls'
  >('idle');

  const animationStepsSig = useSignal<AnimationStep[] | null>(null);
  const animationIndexSig = useSignal(0);

  const rebuildGrid = $((rows: number, cols: number) => {
    gridSig.value = createGrid({
      rowCount: rows,
      colCount: cols,
      start: startSig.value,
      finish: finishSig.value
    });
  });

  const clearGrid$ = $(() => {
    if (isRunningSig.value) return;
    gridSig.value = resetGridState(gridSig.value, finishSig.value);
  });

  const clearWalls$ = $(() => {
    if (isRunningSig.value) return;
    gridSig.value = clearWalls(gridSig.value);
  });

  const toggleView$ = $(() => {
    if (isRunningSig.value) return;

    clearGrid$();
    clearWalls$();

    const nextIsDesktop = !isDesktopViewSig.value;

    if (!nextIsDesktop) {
      const { row: sRow, col: sCol } = startSig.value;
      const { row: fRow, col: fCol } = finishSig.value;
      if (
        sRow >= MOBILE_ROWS ||
        fRow >= MOBILE_ROWS ||
        sCol >= MOBILE_COLS ||
        fCol >= MOBILE_COLS
      ) {
        // Qwik-friendly alternative to alert could be a toast; keep simple for now.
        // eslint-disable-next-line no-alert
        alert(
          'Start & Finish nodes must be within 10 rows x 20 columns for mobile view.'
        );
        return;
      }
    }

    isDesktopViewSig.value = nextIsDesktop;
    const rows = nextIsDesktop ? DESKTOP_ROWS : MOBILE_ROWS;
    const cols = nextIsDesktop ? DESKTOP_COLS : MOBILE_COLS;
    rebuildGrid(rows, cols);
  });

  const handleMouseDown$ = $((row: number, col: number) => {
    if (isRunningSig.value) return;

    const grid = gridSig.value;

    if (!grid || grid.length === 0) return;

    if (!gridHasVisitedOrPath(grid)) {
      const node = grid[row][col];
      if (node.isStart) {
        modeSig.value = 'drag-start';
      } else if (node.isFinish) {
        modeSig.value = 'drag-finish';
      } else {
        gridSig.value = toggleWall(grid, row, col);
        modeSig.value = 'draw-walls';
      }
      mouseIsPressedSig.value = true;
    } else {
      clearGrid$();
    }
  });

  const handleMouseEnter$ = $((row: number, col: number) => {
    if (isRunningSig.value) return;
    if (!mouseIsPressedSig.value) return;

    const grid = gridSig.value;
    const mode = modeSig.value;

    if (mode === 'drag-start') {
      const currentStart = startSig.value;
      const prev = grid[currentStart.row][currentStart.col];
      prev.isStart = false;

      startSig.value = { row, col };
      const curr = grid[row][col];
      curr.isStart = true;
    } else if (mode === 'drag-finish') {
      const currentFinish = finishSig.value;
      const prev = grid[currentFinish.row][currentFinish.col];
      prev.isFinish = false;

      finishSig.value = { row, col };
      const curr = grid[row][col];
      curr.isFinish = true;
    } else if (mode === 'draw-walls') {
      gridSig.value = toggleWall(grid, row, col);
    }
  });

  const handleMouseUp$ = $(() => {
    if (isRunningSig.value) return;
    mouseIsPressedSig.value = false;
    modeSig.value = 'idle';
    gridSig.value = resetGridState(gridSig.value, finishSig.value);
  });

  const handleMouseLeave$ = $(() => {
    mouseIsPressedSig.value = false;
    modeSig.value = 'idle';
  });

  const runAlgorithm = $((algo: AlgorithmName) => {
    if (isRunningSig.value) return;

    clearGrid$();

    const grid = gridSig.value;
    const startNode = grid[startSig.value.row][startSig.value.col];
    const finishNode = grid[finishSig.value.row][finishSig.value.col];

    let visited: any[] = [];
    switch (algo) {
      case 'Dijkstra':
        visited = dijkstra(grid, startNode, finishNode);
        break;
      case 'AStar':
        visited = aStar(grid, startNode, finishNode);
        break;
      case 'BFS':
        visited = bfs(grid, startNode, finishNode);
        break;
      case 'DFS':
        visited = dfs(grid, startNode, finishNode);
        break;
      default:
        visited = [];
    }

    const shortestPathNodes = getNodesInShortestPathOrder(finishNode);
    const steps = buildAnimationSteps(visited, shortestPathNodes);

    animationStepsSig.value = steps;
    animationIndexSig.value = 0;
    isRunningSig.value = true;
  });

  const runDijkstra$ = $(() => runAlgorithm('Dijkstra'));
  const runAStar$ = $(() => runAlgorithm('AStar'));
  const runBfs$ = $(() => runAlgorithm('BFS'));
  const runDfs$ = $(() => runAlgorithm('DFS'));

  useVisibleTask$(({ cleanup }) => {
    let timer: number | undefined;

    const tick = () => {
      const steps = animationStepsSig.value;
      if (!steps || !steps.length) return;

      const idx = animationIndexSig.value;
      if (idx >= steps.length) return;

      const step = steps[idx];
      const grid = gridSig.value;

      if (step.type === 'visit' || step.type === 'path') {
        const node = grid[step.row][step.col];
        if (step.type === 'visit') {
          node.isVisited = true;
        } else {
          node.isInShortestPath = true;
        }
      } else if (step.type === 'done') {
        isRunningSig.value = false;
        animationStepsSig.value = null;
        return;
      }

      animationIndexSig.value = idx + 1;
      timer = window.setTimeout(tick, step.type === 'visit' ? 10 : 40);
    };

    if (animationStepsSig.value && isRunningSig.value) {
      timer = window.setTimeout(tick, 10);
    }

    cleanup(() => {
      if (timer !== undefined) window.clearTimeout(timer);
    });
  });

  const clearAllAndReset$ = $(() => {
    if (isRunningSig.value) return;
    startSig.value = { ...INITIAL_START };
    finishSig.value = { ...INITIAL_FINISH };
    const rows = isDesktopViewSig.value ? DESKTOP_ROWS : MOBILE_ROWS;
    const cols = isDesktopViewSig.value ? DESKTOP_COLS : MOBILE_COLS;
    gridSig.value = createGrid({
      rowCount: rows,
      colCount: cols,
      start: startSig.value,
      finish: finishSig.value
    });
  });

  const grid = gridSig.value;

  return (
    <PageBaseContainer class="flex flex-col gap-4 text-white">
      <h1 class="text-3xl font-bold">Pathfinding Visualizer</h1>
      <OptionsMenu
        clearGrid$={clearGrid$}
        clearWalls$={clearWalls$}
        clearAllAndReset$={clearAllAndReset$}
        runDijkstra$={runDijkstra$}
        runAStar$={runAStar$}
        runBfs$={runBfs$}
        runDfs$={runDfs$}
        isDesktopViewSig={isDesktopViewSig}
        toggleView$={toggleView$}
      />

      <div class="overflow-x-auto">
        <PathGrid
          grid={grid}
          onMouseDown$={handleMouseDown$}
          onMouseEnter$={handleMouseEnter$}
          onMouseUp$={handleMouseUp$}
          onMouseLeave$={handleMouseLeave$}
        />
      </div>
    </PageBaseContainer>
  );
});

export const head: DocumentHead = {
  title: 'Pathfinding Visualizer · Algorithm Adventures'
};
