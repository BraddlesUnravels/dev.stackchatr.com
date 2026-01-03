import { component$, useComputed$ } from '@builder.io/qwik';
import { QButton } from '~/types';

interface ButtonProps extends QButton {
  label?: string;
}

export const Button = component$(
  ({ label = 'Click Me', ...rest }: ButtonProps) => {
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
  }
);
