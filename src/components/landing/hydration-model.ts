export interface HydrationPhase {
  id: number;
  label: string;
  detail: string;
}

export const HYDRATION_PHASES: HydrationPhase[] = [
  {
    id: 1,
    label: "HTML shell renders instantly",
    detail: "Your browser gets a full page of HTML from the server—no waiting for JavaScript to download.",
  },
  {
    id: 2,
    label: "Tiny listeners attach on scroll / click",
    detail: "Qwik resumes components exactly where the user interacts instead of booting the whole app.",
  },
  {
    id: 3,
    label: "Code streams in on demand",
    detail: "Event handlers are split into lazy-loaded chunks, so the initial bundle stays tiny.",
  },
];

export const HYDRATION_PHASE_DELAYS = [400, 950, 1600] as const;

export function getHydrationPhases(): HydrationPhase[] {
  return HYDRATION_PHASES;
}

export function getHydrationPhaseDelays(): readonly number[] {
  return HYDRATION_PHASE_DELAYS;
}
