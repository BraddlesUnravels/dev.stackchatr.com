import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import type { FreeformNode, NodeType, Graph, PathResult } from './constants';
import { ANIMATION_STEP_DELAY, MIN_NODE_DISTANCE, SEARCH_RADIUS } from './constants';
import {
  newNodeId,
  buildDistanceMap,
  euclideanDistance,
  clampCoordinates,
  isNodeTooClose,
  getRelativeMousePosition,
  updateNodeType,
  removeNodeByType,
  resetNodeStates
} from './utils';
import { dijkstra, aStar } from '../../algorithms';
import { Controller } from './button-menu';
import { DebugPanel } from './debug-panel';
import { EdgeVisualization } from './edge-visualization';
import { NodeRenderer } from './node-renderer';

export const NodeContainer = component$(() => {
  const containerRef = useSignal<HTMLDivElement>();
  const nodes = useSignal<FreeformNode[]>([]);
  const startNode = useSignal<FreeformNode | null>(null);
  const finishNode = useSignal<FreeformNode | null>(null);

  const placementMode = useSignal<NodeType>('start');
  const isDragging = useSignal(false);
  const draggedNodeId = useSignal<string | null>(null);
  const dragOffset = useSignal({ x: 0, y: 0 });
  const wasDragging = useSignal(false);
  const isPaintingWalls = useSignal(false);

  // Distance map
  const distanceMap = useSignal<Graph>(new Map());
  const searchRadius = useSignal(SEARCH_RADIUS);
  const showConnections = useSignal(false);
  const animationIndex = useSignal(0);

  // Signal to run pathfinding
  const algorithm = useSignal<'dijkstra' | 'a-star'>('dijkstra');
  const result = useSignal<PathResult | null>(null);
  const isAnimating = useSignal(false);
  const animationPhase = useSignal<'idle' | 'visiting' | 'path'>('idle');

  useVisibleTask$(({ track, cleanup }) => {
    const animating = track(() => isAnimating.value);
    const phase = track(() => animationPhase.value);
    const index = track(() => animationIndex.value);
    const r = track(() => result.value);

    if (!animating || !r) return;

    const timeoutId = setTimeout(() => {
      if (phase === 'visiting') {
        if (index >= r.visitedOrder.length) {
          animationPhase.value = 'path';
          animationIndex.value = 0;
          return;
        }

        const nodeId = r.visitedOrder[index];
        const node = nodes.value.find((n) => n.id === nodeId);
        if (node && node.type === 'normal') {
          nodes.value = updateNodeType(nodes.value, nodeId, 'visited');
        }
        animationIndex.value = index + 1;
      } else if (phase === 'path') {
        if (index >= r.path.length) {
          animationPhase.value = 'idle';
          isAnimating.value = false;
          return;
        }

        const nodeId = r.path[index];
        const node = nodes.value.find((n) => n.id === nodeId);
        if (node && node.type !== 'start' && node.type !== 'finish' && node.type !== 'wall') {
          nodes.value = updateNodeType(nodes.value, nodeId, 'path');
        }
        animationIndex.value = index + 1;
      }
    }, ANIMATION_STEP_DELAY);

    cleanup(() => clearTimeout(timeoutId));
  });

  // Run pathfinding when start/finish or nodes change
  const runPathfinding$ = $((algorithm: 'dijkstra' | 'a-star') => {
    if (!startNode.value || !finishNode.value || nodes.value.length === 0) {
      result.value = null;
      return;
    }
    const graph = distanceMap.value;
    const startId = startNode.value.id;
    const finishId = finishNode.value.id;
    const nodesList = nodes.value;
    let pathResult: PathResult | null = null;

    if (algorithm === 'dijkstra') {
      pathResult = dijkstra(graph, startId, finishId);
    } else if (algorithm === 'a-star') {
      pathResult = aStar(graph, startId, finishId, nodesList);
    }
    if (!pathResult) return;

    result.value = pathResult;

    // reset node types (except start/finish/wall)
    nodes.value = resetNodeStates(nodes.value);

    animationPhase.value = 'visiting';
    animationIndex.value = 0;
    isAnimating.value = true;
  });

  // Recompute distances when nodes change
  const updateDistances$ = $(() => {
    distanceMap.value = buildDistanceMap(nodes.value, searchRadius.value);

    if (startNode.value && finishNode.value) {
      // Log distances for debugging
      const startDistances = distanceMap.value.get(startNode.value.id);
      const distToFinish = startDistances?.get(finishNode.value.id);
      if (distToFinish !== undefined) {
        throw new Error(`Direct edge from start -> finish: ${distToFinish.toFixed(2)}px`);
      }
    }
  });

  // Helper to place a wall at coordinates
  const placeWall$ = $((x: number, y: number) => {
    if (isNodeTooClose(x, y, nodes.value, MIN_NODE_DISTANCE)) return;

    const newWall: FreeformNode = {
      id: newNodeId(),
      x,
      y,
      type: 'wall'
    };

    nodes.value = [...nodes.value, newWall];
  });

  // Place node on click
  const handleContainerClick$ = $((e: MouseEvent) => {
    if (!containerRef.value || isDragging.value || wasDragging.value) {
      wasDragging.value = false;
      return;
    }

    const { x, y } = getRelativeMousePosition(e, containerRef.value);

    // For walls, start painting mode
    if (placementMode.value === 'wall') {
      placeWall$(x, y);
      return;
    }

    const newNode: FreeformNode = {
      id: newNodeId(),
      x,
      y,
      type: placementMode.value
    };

    // Remove existing start/finish if placing new one
    if (placementMode.value === 'start') {
      nodes.value = removeNodeByType(nodes.value, 'start');
      startNode.value = newNode;
      placementMode.value = 'finish'; // Switch to finish after placing start
    } else if (placementMode.value === 'finish') {
      nodes.value = removeNodeByType(nodes.value, 'finish');
      finishNode.value = newNode;
    }

    nodes.value = [...nodes.value, newNode];
    updateDistances$();
  });

  // Start dragging
  const handleNodeMouseDown$ = $((e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.value.find((n) => n.id === nodeId);
    if (!node || !containerRef.value) return;

    isDragging.value = true;
    draggedNodeId.value = nodeId;

    const { x: mouseX, y: mouseY } = getRelativeMousePosition(e, containerRef.value);
    dragOffset.value = {
      x: mouseX - node.x,
      y: mouseY - node.y
    };
  });

  // Drag node
  const handleMouseMove$ = $((e: MouseEvent) => {
    if (!containerRef.value) return;

    const { x: mouseX, y: mouseY } = getRelativeMousePosition(e, containerRef.value);

    // Handle wall painting
    if (isPaintingWalls.value && placementMode.value === 'wall') {
      placeWall$(mouseX, mouseY);
      return;
    }

    // Handle node dragging
    if (!isDragging.value || !draggedNodeId.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    const { x, y } = clampCoordinates(mouseX - dragOffset.value.x, mouseY - dragOffset.value.y, {
      width: rect.width,
      height: rect.height
    });

    nodes.value = nodes.value.map((n) => (n.id === draggedNodeId.value ? { ...n, x, y } : n));

    // Update start/finish refs
    if (startNode.value?.id === draggedNodeId.value) {
      startNode.value = { ...startNode.value, x, y };
    }
    if (finishNode.value?.id === draggedNodeId.value) {
      finishNode.value = { ...finishNode.value, x, y };
    }
  });

  // Stop dragging
  const handleMouseUp$ = $(() => {
    if (isDragging.value) {
      isDragging.value = false;
      draggedNodeId.value = null;
      wasDragging.value = true; // Set flag to prevent click dropping a new node
      updateDistances$();
    }

    // Stop wall painting and update distances
    if (isPaintingWalls.value) {
      isPaintingWalls.value = false;
      updateDistances$();
    }
  });

  // Delete node on right-click
  const handleNodeContextMenu$ = $((e: MouseEvent, nodeId: string) => {
    e.preventDefault();
    nodes.value = nodes.value.filter((n) => n.id !== nodeId);

    if (startNode.value?.id === nodeId) startNode.value = null;
    if (finishNode.value?.id === nodeId) finishNode.value = null;
  });

  // Clear all
  const clearAll$ = $(() => {
    nodes.value = [];
    startNode.value = null;
    finishNode.value = null;
    distanceMap.value = new Map();
    result.value = null;
  });

  return (
    <>
      <h1 class="text-3xl font-bold">Freeform Pathfinding</h1>

      <Controller
        placeStartNode$={$(() => (placementMode.value = 'start'))}
        disableStartNode={!!startNode.value}
        placeEndNode$={$(() => (placementMode.value = 'finish'))}
        disableEndNode={!!finishNode.value}
        placeWalls$={$(() => (placementMode.value = 'wall'))}
        placeNodes$={$(() => (placementMode.value = 'normal'))}
        clearGrid$={clearAll$}
        runDijkstra$={$(() => runPathfinding$('dijkstra'))}
        runAStar$={$(() => runPathfinding$('a-star'))}
        showEdges$={$(() => (showConnections.value = !showConnections.value))}
      />

      {/* Instructions */}
      <div class="text-sm text-gray-400">
        Click to place nodes • Drag to move • Right-click to delete
      </div>

      {/* Container */}
      <div
        ref={containerRef}
        class="relative h-[60vh] w-full cursor-crosshair overflow-hidden rounded-lg border-2 border-emerald-500/50 bg-slate-900/70 shadow-2xl backdrop-blur-sm md:max-w-[80vw]"
        onClick$={handleContainerClick$}
        onMouseMove$={handleMouseMove$}
        onMouseUp$={handleMouseUp$}
        onMouseLeave$={handleMouseUp$}
      >
        {/* Draw connection lines */}
        <EdgeVisualization
          nodes={nodes.value}
          searchRadius={searchRadius.value}
          show={showConnections.value}
        />

        <NodeRenderer
          nodes={nodes.value}
          onMouseDown$={handleNodeMouseDown$}
          onContextMenu$={handleNodeContextMenu$}
        />

        {/* Debug info */}
        <DebugPanel
          placementMode={placementMode.value}
          nodes={nodes.value}
          startNode={startNode.value}
          finishNode={finishNode.value}
          result={result.value}
          searchRadius={searchRadius.value}
        />
      </div>
    </>
  );
});
