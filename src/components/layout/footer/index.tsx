import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const year = new Date().getFullYear();
  return (
    <footer class="footer w-full mt-4">
      <span class="w-full text-center text-emerald-500 text-xs">
        <p>© {year} Skill Portfolio of Bradley Laskey. All rights reserved.</p>
      </span>
    </footer>
  );
});
