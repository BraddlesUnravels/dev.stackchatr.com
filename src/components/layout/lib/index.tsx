import { component$, Slot, QwikIntrinsicElements } from '@builder.io/qwik';
import type { QDiv, QMain } from '~/types';

interface AppContainerProps extends QDiv {
  class?: string;
}

interface BasicPageContainerProps extends QMain {
  class?: string;
}

export const AppBaseContainer = component$(({ class: className, ...props }: AppContainerProps) => {
  return (
    <div
      id="id-app-base-container"
      key="key-app-base-container"
      class={`h-screen w-screen ${className ?? ''}`}
      {...props}
    >
      <Slot />
    </div>
  );
});

export const SlotContainer = component$(({ class: className, ...props }: BasicPageContainerProps) => {
  return (
    <div
      id="id-base-content-container"
      key="key-base-content-container"
      class={`flex flex-1 h-full w-full ${className ?? ''}`}
      {...props}
    >
      <Slot />
    </div>
  );
});

export const PageBaseContainer = component$(({ class: className, ...props }: BasicPageContainerProps) => {
  return (
    <div
      id="id-base-page-container"
      key="key-base-page-container"
      class={`flex flex-1 h-full w-full flex-col items-center justify-start px-6 ${className ?? ''}`}
      {...props}
    >
      <Slot />
    </div>
  );
});