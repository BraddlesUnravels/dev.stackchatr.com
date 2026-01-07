import { component$, Slot, type QRL } from '@builder.io/qwik';

interface AlgorithmButtonProps {
  onClick$?: QRL<() => void>;
  disabled?: boolean;
  position?: 'first' | 'middle' | 'last';
  label?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const AlgorithmButton = component$<AlgorithmButtonProps>(
  ({ onClick$, disabled = false, position = 'middle', label, type = 'button' }) => {
    const getRoundedClass = () => {
      switch (position) {
        case 'first':
          return 'rounded-l-lg';
        case 'last':
          return 'rounded-r-lg';
        default:
          return 'rounded-none';
      }
    };

    return (
      <button
        type={type}
        onClick$={onClick$}
        disabled={disabled}
        class={` ${getRoundedClass()} bg-slate-700/60 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-slate-600/70 hover:shadow-lg focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none active:scale-95 active:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-slate-700/60`}
      >
        {label || <Slot />}
      </button>
    );
  }
);

interface ButtonGroupProps {
  class?: string;
}

export const ButtonGroup = component$<ButtonGroupProps>(({ class: className }) => {
  return (
    <div class={`inline-flex overflow-hidden rounded-lg shadow-lg ${className || ''} `}>
      <Slot />
    </div>
  );
});
