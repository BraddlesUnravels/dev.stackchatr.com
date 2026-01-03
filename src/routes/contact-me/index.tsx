import { component$ } from '@builder.io/qwik';
import { PageBaseContainer } from '~/components/layout/lib';

export default component$(() => {
  return (
    <PageBaseContainer>
      <h1 class="text-4xl font-bold text-white">Contact Me</h1>
    </PageBaseContainer>
  );
});
