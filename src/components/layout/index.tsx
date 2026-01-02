import { component$ } from '@builder.io/qwik';
import NavBar from './nav-bar';
import Footer from './footer';
import { AppBaseContainer, SlotContainer } from './lib';
import { Slot } from '@builder.io/qwik';
import { appBgGradient } from '~/constants';

export default component$(() => {
  return (
    <AppBaseContainer class={appBgGradient.original}>
      <NavBar />

      <SlotContainer>
        <Slot />
      </SlotContainer>

      <Footer />
    </AppBaseContainer>
  );
});
