import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link, routeLoader$ } from "@builder.io/qwik-city";

export const useCatchall = routeLoader$(({ params, env }) => {
  const catchall = params.catchall?.split("/") ?? []; // or params.catchall ?? ""

  return {
    catchall,
    env: {
      mode: env.get("NODE_ENV") || "None Specified",
      domain: env.get("APP_DOMAIN") || "None Specified",
      port: env.get("APP_PORT") || "None Specified",
    },
  };
});

export default component$(() => {
  const data = useCatchall();
  return (
    <div style="padding: 2rem;">
      <h1>Catch-All Route</h1>
      <p>This route captures all unmatched paths.</p>
      <h2>Captured Parameters:</h2>
      <pre>{JSON.stringify(data.value.catchall, null, 2)}</pre>
      <h2>Environment Variables:</h2>
      <pre>{JSON.stringify(data.value.env, null, 2)}</pre>
      <Link href="/">Go Back Home</Link>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Catch-All Route",
  meta: [
    {
      name: "description",
      content: "A catch-all route example in Qwik City.",
    },
  ],
};
