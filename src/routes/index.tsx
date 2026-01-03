import { component$ } from '@builder.io/qwik';
import { LandingHero } from '~/components/landing/hero';
import type { DocumentHead } from '@builder.io/qwik-city';
import { PageBaseContainer } from '~/components/layout/lib';

export default component$(() => {
  return (
    <PageBaseContainer class="">
      <LandingHero />
    </PageBaseContainer>
  );
});

export const head: DocumentHead = {
  title: 'Instant, then interactive · Skills Showcase',
  meta: [
    {
      name: 'description',
      content:
        'A Qwik-powered landing page that renders instantly as HTML, then progressively wakes up interactions.'
    }
  ]
};
