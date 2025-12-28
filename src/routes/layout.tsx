import { component$, Slot } from "@builder.io/qwik";
import BaseLayout from "~/components/layout";

export default component$(() => {
  return (
    <BaseLayout>
      <Slot />
    </BaseLayout>
  );
});
