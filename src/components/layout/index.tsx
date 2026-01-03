import { component$ } from '@builder.io/qwik';
import NavBar from './nav-bar';
import Footer from './footer';
import { AppBaseContainer } from './lib';
import { Slot } from '@builder.io/qwik';
import { appBgGradient } from '~/constants';

export default component$(() => {
  return (
    <AppBaseContainer>
      <NavBar />

      <main id="main-content-container" class="flex-1">
        <Slot key="main-content-slot" />
      </main>

      <Footer />
    </AppBaseContainer>
  );
});
