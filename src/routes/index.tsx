import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>Skills Showcase</h1>
      <div>
        This is your starting point for a skills portfolio site.
        <br />
        Update this page to highlight your projects, experience, and expertise.
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Skills Showcase",
  meta: [
    {
      name: "description",
      content: "A skills portfolio site built with Qwik City.",
    },
  ],
};
