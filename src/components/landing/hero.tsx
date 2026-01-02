import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { HeroCopy } from "./hero-copy";
import { HydrationVisualizer } from "./hydration-visualizer";
import { getHydrationPhaseDelays } from "./hydration-model";

export const LandingHero = component$(() => {
  const activePhase = useSignal(0);
  const clicks = useSignal(0);

  useVisibleTask$(({ cleanup }) => {
    const delays = getHydrationPhaseDelays();
    const timers: number[] = [];

    delays.forEach((delay, index) => {
      const id = window.setTimeout(() => {
        activePhase.value = index + 1;
      }, delay);
      timers.push(id);
    });

    cleanup(() => timers.forEach((id) => window.clearTimeout(id)));
  });

  return (
    <div class="h-full w-full max-w-7xl flex gap-16 justify-center items-center">
      <HeroCopy
        clicks={clicks.value}
        onWakeClick$={() => (clicks.value = clicks.value + 1)}
      />
      <HydrationVisualizer activePhase={activePhase.value} />
    </div>
  );
});
