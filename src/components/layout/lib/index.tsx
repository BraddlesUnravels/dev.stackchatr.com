import { component$, Slot } from '@builder.io/qwik';
import type { QDiv } from '~/types';

interface ContainerProps extends QDiv {
  class?: string;
}

export const AppBaseContainer = component$(({ class: className, ...props }: ContainerProps) => {
  return (
    <div
      id="id-app-base-container"
      key="key-app-base-container"
      class={`flex min-h-screen w-full flex-col overflow-x-hidden ${className ?? ''}`}
      {...props}
    >
      <Slot />
    </div>
  );
});

export const PageBaseContainer = component$(({ class: className, ...props }: ContainerProps) => {
  return (
    <div
      id="id-base-page-container"
      class={`flex-1 flex w-full mx-auto px-4 py-4 md:px-6 md:py-6 md:max-w-7xl ${className ?? ''}`}
      key="key-base-page-container"
      {...props}
    >
      <Slot />
    </div>
  );
});