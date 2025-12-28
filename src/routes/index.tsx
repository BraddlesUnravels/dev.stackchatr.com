import { component$ } from "@builder.io/qwik";
import { BasiPageContainer } from "~/components/layout/lib";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <BasiPageContainer></BasiPageContainer>;
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
