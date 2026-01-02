import { component$ } from "@builder.io/qwik";
import { getHydrationPhases } from "./hydration-model";
import { PhaseRow } from "./phase-row";

interface HydrationVisualizerProps {
  activePhase: number;
}

export const HydrationVisualizer = component$<HydrationVisualizerProps>(
  ({ activePhase }) => {
    const phases = getHydrationPhases();

    return (
      <section aria-label="Hydration visualizer" class="">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Qwik hydration
            </p>
            <p class="mt-1 text-sm font-medium text-slate-100">
              Watch islands wake up one by one
            </p>
          </div>
          <span class="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            Live demo
          </span>
        </div>

        <div class="space-y-4 text-xs text-slate-300/90">
          {phases.map((phase) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              active={activePhase >= phase.id}
            />
          ))}
        </div>

        <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
      </section>
    );
  }
);
