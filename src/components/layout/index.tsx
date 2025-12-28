import { component$ } from "@builder.io/qwik";
import NavBar from "./nav-bar";
import Footer from "./footer";
import { Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="base-layout-container">
      <NavBar />

      <Slot />

      <Footer />
    </div>
  );
});
