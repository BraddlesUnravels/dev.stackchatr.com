import { component$ } from '@builder.io/qwik';

export default component$(() => {
  const year = new Date().getFullYear();
  return (
    <footer class="footer">
      <span class="w-full text-center text-xs text-emerald-500">
        <p>© {year} Skill Portfolio of Bradley Laskey. All rights reserved.</p>
      </span>
    </footer>
  );
});
