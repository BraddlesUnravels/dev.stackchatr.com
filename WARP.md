# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

- Skills portfolio site built with **Qwik City**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Bun** (see `README.md`).
- Node runtime requirement is **Node >= 22.0.0** (see `package.json` `engines`), with Bun used for local workflows (`bun.lock`, `README.md`, `Dockerfile`).

## Development commands

Use **Bun** for the primary workflow (matches `README.md` and `Dockerfile`), or `npm` if you prefer the Node toolchain. All commands run from the repository root.

### Install dependencies

- With Bun (preferred): `bun install`
- With npm: `npm install`

### Local development server

- Bun: `bun dev`
- npm: `npm run dev`

Both start the Qwik SSR dev server on port `3000` (configured in `vite.config.ts`).

### Open-in-browser dev server

If you want the browser to auto-open:

- Bun: `bun start`
- npm: `npm run start`

### Production build and preview

- Build (Qwik production build):
  - Bun: `bun build`
  - npm: `npm run build`
- Type checking only:
  - Bun: `bun run build.types`
  - npm: `npm run build.types`
- Preview the production build (non-adapter preview server):
  - Bun: `bun preview`
  - npm: `npm run preview`

### Linting and formatting

ESLint is configured via `eslint.config.js` with TypeScript and Qwik-specific rules.

- Lint TypeScript/Qwik sources:
  - Bun: `bun lint`
  - npm: `npm run lint`
- Format with Prettier (write):
  - Bun: `bun fmt`
  - npm: `npm run fmt`
- Format check only:
  - Bun: `bun fmt.check`
  - npm: `npm run fmt.check`

Note: `eslint.config.js` globally ignores many generated/build artifacts (e.g. `dist`, `build`, `server`, lockfiles, config files). When adding new source files you expect to be linted, place them under `src/` and avoid the ignored patterns.

### Tests

Vitest is configured in `vitest.config.ts`, but no `test` npm script is currently defined.

- Run the Vitest test runner directly (Node toolchain): `npx vitest`
- Or with Bun: `bun x vitest`

Vitest is set up with:

- `tsconfig` path resolution via `vite-tsconfig-paths` (so `~/*` aliases into `src/*`).
- A Node test environment and forked worker pool.
- Exclusion of build artifacts, node_modules, and most config/entry files (see `exclude` in `vitest.config.ts`).

When adding tests, prefer placing them alongside source files under `src/` with standard `*.test.ts[x]` or `*.spec.ts[x]` naming. Note that `eslint.config.js` currently ignores `**/*.spec.ts[x]` patterns.

### Docker image

The `Dockerfile` is a multi-stage build using Bun and Node:

1. **base**: `oven/bun` image, installs dependencies with `bun install`.
2. **builder**: adds Node/npm, copies `node_modules` and sources, runs `npm run build` to produce `dist` and `server` outputs.
3. **final**: runs as non-root `qwik` user, copies `dist` and `server`, exposes port `3000`, and starts with `CMD ["bun", "run", "serve"]`.

There is currently no `serve` script in `package.json`; if you intend to run this container, you should add a `"serve"` script (e.g., a Qwik adapter entrypoint) or adjust `CMD` accordingly.

## Architecture overview

### Framework and entry points

- Root Qwik component is `src/root.tsx`:
  - Wraps the app in `QwikCityProvider`.
  - Sets the HTML `<head>` meta/manifest tags and wires in `RouterHead`.
  - Renders the current route via `<RouterOutlet />` in the `<body>`.
- Entry files:
  - `src/entry.ssr.tsx`: main SSR entry using `renderToStream`, adds `lang="en-us"` and passes through server data. This is used by SSR flows (`bun run dev`, `bun run preview`, production build/serve).
  - `src/entry.dev.tsx`: purely client-side dev entry (no SSR); not used in production.
  - `src/entry.preview.tsx`: Vite preview adapter using `createQwikCity` and `@qwik-city-plan` for `npm run preview` / `bun preview`.

### Routing and layouts

Qwik City file-based routes live under `src/routes`:

- `src/routes/layout.tsx`:
  - Wraps all routed content in the shared `BaseLayout` component from `~/components/layout`.
  - Uses `<Slot />` to render per-route content inside the layout shell.
- `src/routes/index.tsx`:
  - Home page route (`/`).
  - Renders a `BasiPageContainer` from `~/components/layout/lib` as the main content wrapper.
  - Declares the document head (title and description) via `DocumentHead` export.
- `src/routes/[...catchall]/index.tsx`:
  - Catch-all route for unmatched paths.
  - Uses `routeLoader$` to expose both the captured path segments and selected environment variables:
    - `NODE_ENV`, `APP_DOMAIN`, `APP_PORT` via `env.get(...)`.
  - The component renders the captured path and env snapshot and provides a link back to `/`.
  - Useful as a debugging/diagnostic route; treat it as such when modifying.

### Shared layout and UI structure

Core layout components live under `src/components/layout`:

- `src/components/layout/index.tsx` (`BaseLayout`):
  - High-level page shell with `.base-layout-container` wrapper.
  - Composes `NavBar` at the top, `<Slot />` for page content, and `Footer` at the bottom.
- `src/components/layout/nav-bar/index.tsx`:
  - Main navigation bar using Tailwind utility classes.
  - Uses `Link` from `@builder.io/qwik-city` to route between `Home`, `Projects`, `About`, and `Contact` paths.
  - When adding routes for these links, create corresponding files under `src/routes`.
- `src/components/layout/footer/index.tsx`:
  - Simple footer with copyright text.
- `src/components/layout/lib/index.tsx`:
  - `BasiPageContainer` (note the current spelling) is a generic container component built on a Qwik `<div>`.
  - Applies `max-w-screen max-h-screen` by default and accepts an optional `class` prop to extend styling and arbitrary div props.

### Document head management

- `src/components/router-head/router-head.tsx`:
  - Centralizes `<head>` management for the app.
  - Uses Qwik City hooks `useDocumentHead` and `useLocation`.
  - Renders `<title>`, canonical `<link>`, viewport `<meta>`, favicon, and iterates over `head.meta`, `head.links`, `head.styles`, and `head.scripts` to render route-specific head entries.
  - When routes define `head` metadata, this component ensures it is correctly injected.

### Styling and theming

Tailwind CSS v4 is wired via the Vite plugin and layered CSS files:

- `src/global.css`:
  - Imports Tailwind via `@import "tailwindcss";`.
  - Composes theme layers by importing `./theme/theme.css`, `./theme/font.css`, `./theme/components.css`, and `./theme/utilities.css`.
- `src/theme/theme.css`:
  - Placeholder `@theme` block; extend this for global theme tokens.
- `src/theme/font.css`:
  - Defines the global font stack using a Space Grotesk Google Font import.
  - Sets `--font-sans` CSS variable and applies it to `body`.
- `src/theme/components.css`:
  - Global component-level base styles under `@layer base`.
  - Currently sets dark background (`#0d1117`), light foreground (`#c9d1d9`), and input number spinner behavior.
- `src/theme/utilities.css`:
  - Utility classes under `@layer utilities`, including:
    - `.base-layout-container` using Tailwind `@apply` to size the main layout.
    - `.nav-bar` applying flexbox, gaps, alignment, and responsive spacing.

When adding new global styles, decide whether they belong in `components.css` (semantic base styles) or `utilities.css` (utility-style classes), and ensure imports remain in `src/global.css`.

### Configuration and path aliases

- `tsconfig.json`:
  - Configures TypeScript for Qwik (`jsxImportSource: "@builder.io/qwik"`, `jsx: "react-jsx"`).
  - Defines path aliases:
    - `~/*` → `./src/*` (primary app alias used in imports like `~/components/layout`).
    - `/*` → project root.
  - Includes `src`, root `*.d.ts`, `*.config.ts`, and `src/types`.
- `vite.config.ts`:
  - Adds plugins: `@tailwindcss/vite`, `qwikCity`, `qwikVite`, and `vite-tsconfig-paths`.
  - Sets dev server headers to disable caching in dev and port `3000`.
  - Configures preview headers for short-term caching.
  - Includes `errorOnDuplicatesPkgDeps` helper that enforces:
    - All Qwik packages must be in `devDependencies`.
    - No package appears in both `dependencies` and `devDependencies`.

Be cautious when editing `package.json` dependencies; violating these constraints will cause Vite to throw during startup.

## Notes for future Warp sessions

- Prefer Bun for local development to stay aligned with `README.md` and Dockerfile, but npm scripts are equivalent.
- When creating new routes, follow Qwik City file-based routing under `src/routes` and ensure they integrate with `BaseLayout` (via `src/routes/layout.tsx`).
- Use the `~` alias for imports from `src` instead of long relative paths, and keep new source within `src/` so it participates in the existing tooling (Vite, ESLint, Vitest).