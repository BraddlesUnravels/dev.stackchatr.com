import { component$ } from "@builder.io/qwik";
import type { HydrationPhase } from "./hydration-model";

interface PhaseRowProps {
  phase: HydrationPhase;
  active: boolean;
}

export const PhaseRow = component$<PhaseRowProps>(({ phase, active }) => {
  return (
    <div class="flex items-start gap-3">
      <div class="mt-0.5 flex items-center gap-2">
        <span
          class={
            "flex h-2.5 w-2.5 items-center justify-center rounded-full border border-slate-700/80 bg-slate-800/90 transition-all duration-500 " +
            (active
              ? "scale-110 border-emerald-400/80 bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]"
              : "opacity-40")
          }
        />
        <span class="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
          step {phase.id}
        </span>
      </div>
      <div class="space-y-1">
        <p class="text-xs font-medium text-slate-100">{phase.label}</p>
        <p class="text-[11px] leading-relaxed text-slate-400">{phase.detail}</p>
      </div>
    </div>
  );
});
