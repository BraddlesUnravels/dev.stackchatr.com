import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <header class="w-full p-4 bg-transparent text-white">
      <nav class="nav-bar">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/cool-stuff">Cool Stuff</Link>
        <Link href="/contact-me">Contact Me</Link>
      </nav>
    </header>
  );
});
