import { component$, useComputed$, QRL } from '@builder.io/qwik';
import { QButton } from '~/types';

interface ButtonProps extends QButton {
  label?: string;
}

const colorClasses = {
  blue: 'bg-blue-500 hover:bg-blue-400 focus-visible:ring-blue-300 text-white shadow-blue-500/30',
  green:
    'bg-emerald-500 hover:bg-emerald-400 focus-visible:ring-emerald-300 text-slate-950 shadow-emerald-500/30',
  red: 'bg-red-500 hover:bg-red-400 focus-visible:ring-red-300 text-white shadow-red-500/30'
};

const roundedClasses = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full'
};

export const Button = component$(({ label = 'Click Me', ...rest }: ButtonProps) => {
  const className = useComputed$(() => {
    return [
      'inline-flex items-center rounded-lg',
      'bg-emerald-500 px-4 py-2 text-sm font-semibold',
      'text-slate-950 shadow-lg shadow-emerald-500/30',
      'transition hover:bg-emerald-400 focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-emerald-300',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
      rest.class || ''
    ].join(' ');
  });

  return (
    <button class={className.value} {...rest}>
      {label}
    </button>
  );
});

interface MenuButtonProps extends QButton {
  label?: string;
  onClick$?: QRL<() => void>;
  class?: string;
}

export const MenuButton = component$(
  ({ label = 'Menu', onClick$, class: className = '', ...rest }: MenuButtonProps) => {
    return (
      <button class={className} onClick$={onClick$} {...rest}>
        {label}
      </button>
    );
  }
);
