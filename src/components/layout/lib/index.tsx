import { component$, Slot, QwikIntrinsicElements } from '@builder.io/qwik';

type QDiv = QwikIntrinsicElements['div'];

interface BasicPageContainerProps extends QDiv {
  class?: string;
}

export const BasiPageContainer = component$(({ class: className, ...props }: BasicPageContainerProps) => {
  return (
    <div class={`max-w-screen max-h-screen ${className ?? ''}`} {...props}>
      <Slot />
    </div>
  );
});
