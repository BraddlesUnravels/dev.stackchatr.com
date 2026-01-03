import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <header class="w-full bg-transparent p-4 text-white">
      <nav class="nav-bar">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/algorithm-adventures">Algorithm Adventures</Link>
        <Link href="/contact-me">Contact Me</Link>
      </nav>
    </header>
  );
});
