import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { PageBaseContainer } from '~/components/layout/lib';
import {
  dijkstra,
  type AdjacencyList
} from '~/utils/algorithms/dijkstra-algorithm';

export default component$(() => {
  const graph: AdjacencyList = [
    [
      [1, 2],
      [2, 5]
    ],
    [
      [2, 1],
      [3, 4]
    ],
    [[3, 1]],
    []
  ];
  const source = 0;
  const distances = dijkstra(graph, source);

  return (
    <PageBaseContainer class="flex flex-col gap-4 text-white">
      <h1 class="text-3xl font-bold">Dijkstra Demo</h1>
      <ul class="space-y-1 text-sm">
        {distances.map((d, node) => (
          <li key={node}>
            Distance from {source} to {node}:{' '}
            {Number.isFinite(d) ? d : 'unreachable'}
          </li>
        ))}
      </ul>
    </PageBaseContainer>
  );
});

export const head: DocumentHead = {
  title: 'Dijkstra Shortest Paths · Algorithm Adventures'
};
