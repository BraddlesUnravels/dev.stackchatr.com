import { component$ } from '@builder.io/qwik';
import { Link, type DocumentHead } from '@builder.io/qwik-city';
import { PageBaseContainer } from '~/components/layout/lib';
import { Card } from '~/components/ui';

export default component$(() => {
  return (
    <PageBaseContainer class="flex flex-col gap-6 text-white">
      <section class="space-y-2">
        <h1 class="text-4xl font-bold">Algorithm Visualization Puzzles</h1>
        <p class="max-w-2xl text-lg text-slate-200">
          A playground of small, focused puzzles where you can sort, search, and path-find your way
          through classic algorithms. The goal is to make algorithms, data structures, and
          performance feel visual and intuitive.
        </p>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 class="text-xl font-semibold">Sorting Lab</h2>
          <p class="mt-2 text-sm text-slate-200">
            Drag and shuffle bars, then watch how different sorting algorithms (like bubble sort,
            insertion sort, and quicksort) reorganize them step by step.
          </p>
          <p class="mt-3 text-xs tracking-wide text-slate-400 uppercase">
            Focus: time complexity, comparisons, swaps
          </p>
        </Card>

        <Card>
          <h2 class="text-xl font-semibold">Searching Challenges</h2>
          <p class="mt-2 text-sm text-slate-200">
            Experiment with linear vs. binary search on the same data set and see how many steps it
            takes to find the target.
          </p>
          <p class="mt-3 text-xs tracking-wide text-slate-400 uppercase">
            Focus: data ordering, search space, big-O
          </p>
        </Card>

        <Card>
          <Link href="/algorithm-adventures/pathfinding-algorithms">
            <h2 class="text-xl font-semibold">Path-finding Playground</h2>
            <p class="mt-2 text-sm text-slate-200">
              Drag start and end nodes, drop walls, and watch algorithms like Dijkstra and A*
              explore the grid in real time.
            </p>
            <p class="mt-3 text-xs tracking-wide text-slate-400 uppercase">
              Focus: graphs, heuristics, shortest paths
            </p>
          </Link>
        </Card>
      </section>

      <section class="max-w-2xl space-y-3 text-sm text-slate-200">
        <h2 class="text-2xl font-semibold">What this page is about</h2>
        <p>
          This page is dedicated to building interactive, visual explanations of algorithms and data
          structures. Each puzzle will be small and focused, so you can explore one idea at a time
          without getting lost in boilerplate.
        </p>
        <p>As this section evolves, expect:</p>
        <ul class="list-disc space-y-1 pl-6">
          <li>Drag-and-drop elements to control input to the algorithms.</li>
          <li>Step-by-step playback controls to pause, rewind, and scrub through executions.</li>
          <li>Inline explanations of time and space complexity tied to what you see on screen.</li>
        </ul>
      </section>
    </PageBaseContainer>
  );
});

export const head: DocumentHead = {
  title: 'Algorithm Visualization Puzzles',
  meta: [
    {
      name: 'description',
      content:
        'Interactive algorithm visualization puzzles for sorting, searching, and path-finding with clear visual explanations.'
    }
  ]
};
