import { component$, type QwikMouseEvent } from "@builder.io/qwik";
import { Button } from "~/components/ui/buttons";

export interface HeroCopyProps {
  clicks: number;
  onWakeClick$: (event: QwikMouseEvent<HTMLButtonElement>) => void;
}

export const HeroCopy = component$<HeroCopyProps>(
  ({ clicks, onWakeClick$ }) => {
    return (
      <section aria-labelledby="hero-title" class="space-y-8">
        <p class="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs font-medium tracking-wide text-slate-300 shadow-sm backdrop-blur">
          <span class="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          Instant, then interactive · Qwik flex
        </p>

        <div class="space-y-4">
          <h1
            id="hero-title"
            class="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          >
            <span class="block">This site loads before you blink.</span>
            <span class="mt-1 block text-slate-300">
              Then it gets interactive — on demand.
            </span>
          </h1>

          <p class="max-w-xl text-sm text-slate-300/90 sm:text-base">
            The hero you are reading is just HTML. Qwik wakes up only the pieces
            that need JavaScript, exactly when they are needed.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <Button label="Wake up an interaction" onClick$={onWakeClick$} />

          <p class="text-xs text-slate-400">
            Button logic ships only when you click it.
          </p>
        </div>

        <div
          class={[
            "space-y-2 transition-opacity duration-300 ease-in-out",
            clicks > 0 ? "opacity-100" : "opacity-0 pointer-events-none",
          ]}
        >
          <p class="text-xs text-slate-400">
            Ah! there it is. The JS has been shipped & received.
          </p>
          <p class="text-xs text-slate-400">
            Now we can use that JS to handle the most boring part...
          </p>
          <p class="text-xs text-slate-400">
            Counting how many more times you click the button: {clicks}.
          </p>
        </div>
      </section>
    );
  }
);
