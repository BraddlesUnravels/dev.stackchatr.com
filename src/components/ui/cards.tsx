import { component$, Slot } from "@builder.io/qwik";

const cardClasses =
  "relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/15 p-6 shadow-lg shadow-black/40 backdrop-blur-sm";

export const Card = component$(() => {
  return (
    <div class={cardClasses}>
      <Slot />
    </div>
  );
});
