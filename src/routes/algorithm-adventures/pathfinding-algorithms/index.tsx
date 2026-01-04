import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { PageBaseContainer } from '~/components/layout/lib';
import type { FreeformNode, NodeType } from './components/constants';
import {
  newNodeId,
  euclidianDistance,
  manhattanDistance,
  findNeighbors,
  buildDistanceMap
} from './components/utils';

export default component$(() => {
  const containerRef = useSignal<HTMLDivElement>();
  const nodes = useSignal<FreeformNode[]>([]);
  const startNode = useSignal<FreeformNode | null>(null);
  const finishNode = useSignal<FreeformNode | null>(null);

  const placementMode = useSignal<NodeType>('start');
  const isDragging = useSignal(false);
  const draggedNodeId = useSignal<string | null>(null);
  const dragOffset = useSignal({ x: 0, y: 0 });
  const wasDragging = useSignal(false);

  // Distance map (not used yet)
  const distanceMap = useSignal<Map<string, Map<string, number>>>(new Map());
  const neighborRadius = useSignal(200); // pixels
  const showConnections = useSignal(false);

  // Recompute distances when nodes change
  const updateDistances$ = $(() => {
    distanceMap.value = buildDistanceMap(nodes.value);

    if (startNode.value && finishNode.value) {
      // Log distances for debugging
      const startDistances = distanceMap.value.get(startNode.value.id);
      const distToFinish = startDistances?.get(finishNode.value.id);
      if (distToFinish !== undefined) {
        console.log(`Direct distance from start to finish: ${distToFinish.toFixed(2)}px`);
      }
    }
  });

  // Place node on click
  const handleContainerClick$ = $((e: MouseEvent) => {
    if (!containerRef.value || isDragging.value || wasDragging.value) {
      wasDragging.value = false;
      return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: FreeformNode = {
      id: newNodeId(),
      x,
      y,
      type: placementMode.value
    };

    // Remove existing start/finish if placing new one
    if (placementMode.value === 'start') {
      nodes.value = nodes.value.filter((n) => n.type !== 'start');
      startNode.value = newNode;
      placementMode.value = 'finish'; // Switch to finish after placing start
    } else if (placementMode.value === 'finish') {
      nodes.value = nodes.value.filter((n) => n.type !== 'finish');
      finishNode.value = newNode;
    }

    nodes.value = [...nodes.value, newNode];
    updateDistances$();
    console.log(`Node placed at: (${x.toFixed(0)}, ${y.toFixed(0)})`);
  });

  // Start dragging
  const handleNodeMouseDown$ = $((e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.value.find((n) => n.id === nodeId);
    if (!node || !containerRef.value) return;

    isDragging.value = true;
    draggedNodeId.value = nodeId;

    const rect = containerRef.value.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    dragOffset.value = {
      x: mouseX - node.x,
      y: mouseY - node.y
    };
  });

  // Deletes any node by given id
  const deleteNodeById$ = $((nodeId: string) => {
    nodes.value = nodes.value.filter((n) => n.id !== nodeId);

    if (startNode.value?.id === nodeId) startNode.value = null;
    if (finishNode.value?.id === nodeId) finishNode.value = null;
  });

  const updateNodePosition$ = $((nodeId: string, x: number, y: number) => {
    nodes.value = nodes.value.map((n) => (n.id === nodeId ? { ...n, x, y } : n));
  });

  // Drag node
  const handleMouseMove$ = $((e: MouseEvent) => {
    if (!isDragging.value || !draggedNodeId.value || !containerRef.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    // Calculate mouse position relative to container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const x = Math.max(10, Math.min(mouseX - dragOffset.value.x, rect.width - 10));
    const y = Math.max(10, Math.min(mouseY - dragOffset.value.y, rect.height - 10));

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
  });

  const getNodeStyle = (node: FreeformNode) => {
    const baseColors = {
      start: 'bg-emerald-500',
      finish: 'bg-rose-500',
      wall: 'bg-slate-',
      visited: 'bg-blue-500',
      path: 'bg-amber-400',
      normal: 'bg-gray-400'
    };

    return baseColors[node.type];
  };

  return (
    <PageBaseContainer class="flex flex-col gap-4 text-white">
      <h1 class="text-3xl font-bold">Freeform Pathfinding</h1>

      {/* Controls */}
      <div class="flex flex-wrap gap-2">
        <button
          class={`rounded px-4 py-2 ${placementMode.value === 'start' ? 'bg-emerald-600' : 'bg-emerald-800'}`}
          onClick$={() => (placementMode.value = 'start')}
        >
          Place Start
        </button>
        <button
          class={`rounded px-4 py-2 ${placementMode.value === 'finish' ? 'bg-rose-600' : 'bg-rose-800'}`}
          onClick$={() => (placementMode.value = 'finish')}
        >
          Place Finish
        </button>
        <button
          class={`rounded px-4 py-2 ${placementMode.value === 'wall' ? 'bg-slate-600' : 'bg-slate-800'}`}
          onClick$={() => (placementMode.value = 'wall')}
        >
          Place Wall
        </button>
        <button
          class="rounded bg-emerald-500 px-4 py-2 hover:bg-emerald-600"
          onClick$={() => (placementMode.value = 'normal')}
        >
          Place Node
        </button>
        <button class="rounded bg-red-600 px-4 py-2 hover:bg-red-700" onClick$={clearAll$}>
          Clear All
        </button>
      </div>

      {/* Instructions */}
      <div class="text-sm text-gray-400">
        Click to place nodes • Drag to move • Right-click to delete
      </div>

      {/* Container */}
      <div
        ref={containerRef}
        class="relative h-[50vh] w-full cursor-crosshair overflow-hidden border-2 border-emerald-500 bg-slate-900"
        onClick$={handleContainerClick$}
        onMouseMove$={handleMouseMove$}
        onMouseUp$={handleMouseUp$}
        onMouseLeave$={handleMouseUp$}
      >
        {/* Draw connection lines */}
        {showConnections.value && (
          <svg class="pointer-events-none absolute inset-0" style="width: 100%; height: 100%;">
            {nodes.value.map((node) => {
              if (node.type === 'wall') return null;
              const neighbors = findNeighbors(node, nodes.value, neighborRadius.value);
              return neighbors.map((neighbor) => (
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
        )}

        {nodes.value.map((node) => (
          <div
            key={node.id}
            class={`absolute h-5 w-5 cursor-move rounded-full ${getNodeStyle(node)} transition-colors`}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseDown$={(e) => handleNodeMouseDown$(e, node.id)}
            onContextMenu$={(e) => handleNodeContextMenu$(e, node.id)}
            title={`${node.type} (${node.x.toFixed(0)}, ${node.y.toFixed(0)})`}
          />
        ))}

        {/* Debug info */}
        <div class="absolute top-2 right-2 max-h-[80%] space-y-1 overflow-y-auto bg-black/90 p-3 text-xs">
          <div class="font-bold text-emerald-400">Distance Info</div>
          <div>Mode: {placementMode.value}</div>
          <div>Nodes: {nodes.value.length}</div>

          {startNode.value && (
            <div class="text-emerald-400">
              Start: ({startNode.value.x.toFixed(0)}, {startNode.value.y.toFixed(0)})
            </div>
          )}

          {finishNode.value && (
            <div class="text-rose-400">
              Finish: ({finishNode.value.x.toFixed(0)}, {finishNode.value.y.toFixed(0)})
            </div>
          )}

          {startNode.value && finishNode.value && (
            <>
              <div class="mt-2 font-bold text-amber-400">
                Euclidean: {euclidianDistance(startNode.value, finishNode.value).toFixed(3)}px
              </div>
              <div class="text-amber-400">Manhattan: {() => manhattanDistance(nodes.value)}px</div>
            </>
          )}

          {nodes.value && nodes.value.length > 0 && (
            <div class="mt-2 border-t border-gray-700 pt-2">
              <p class="font-semibold">All Nodes:</p>
              {nodes.value.map((n) => {
                const neighbors = findNeighbors(n, nodes.value, neighborRadius.value);
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
      </div>
    </PageBaseContainer>
  );
});

export const head: DocumentHead = {
  title: 'Freeform Pathfinding · Algorithm Adventures'
};
