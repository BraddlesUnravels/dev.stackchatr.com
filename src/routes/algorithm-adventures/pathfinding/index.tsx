import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { PageBaseContainer } from '~/components/layout/lib';
import { NodeContainer } from './components/node-container';

export default component$(() => {
  return (
    <PageBaseContainer class="flex flex-col items-center justify-center gap-4 text-white">
      <NodeContainer />
    </PageBaseContainer>
  );
});

export const head: DocumentHead = {
  title: 'Freeform Pathfinding · Algorithm Adventures'
};
