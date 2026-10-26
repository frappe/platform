# Frappe Cloud platform

An overview of how Frappe Cloud v2 works across Central, Atlas, Pilot, Cargo and Frappe.

## Read locally

```sh
yarn install --frozen-lockfile
yarn dev
```

Open http://localhost:5174. The dev server listens on all interfaces for local previews and tunnels.

To expose the preview through a temporary Cloudflare Tunnel:

```sh
cloudflared tunnel --url http://localhost:5174
```

Keep both processes running while using the tunnel URL.

## Build

```sh
yarn build
yarn preview
```

The static output is in `docs/.vitepress/dist`. Set `DOCS_BASE` at build time when serving below a path.

## Edit

Pages live in `docs/content/`. Navigation lives in `docs/.vitepress/sidebar.ts`. The site uses VitePress and the same pinned Frappe UI docs theme as Central's customer docs.

Keep cross-service explanations here. Link to the owning repository for exact contracts, commands and runbooks. Use small diagrams with one question per diagram. Mermaid fences follow the selected theme. The overview uses a responsive architecture map in `CloudArchitecture.vue`.

Use the writing rules from [asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill). Define technical terms before using them. Use short, neutral sentences. Keep explanations visible and move detailed contracts into linked reference pages. Do not use accordions. These rules guide the prose. They do not certify it against the official ASD dictionary.
