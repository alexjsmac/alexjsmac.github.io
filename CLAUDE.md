# alexjsmac.github.io

Portfolio site: React, react-three-fiber (three.js) and Vite on GitHub Pages.

## Workflow: branch → PR → green CI → merge

The workflow setup here is shared with alexjsmac's other site repos
(small-vibrations, bluheron-interactive, alexjsmac.github.io). When you change
it in one, change it in all three.

- `main` is protected by the `main` ruleset (`.github/rulesets/main.json`):
  a PR is required, the `CI` check must pass, force-pushes and deletion are
  blocked, and nobody can bypass it. There's no second approver (solo
  maintainer), so a green PR can be self-merged. Merges are squash-only.
- Work on a branch, open a PR, and merge it yourself once `CI` is green.
  Never push to `main` or bypass `CI`.
- Merging to `main` deploys to production via `.github/workflows/deploy.yml`.
- Before opening a PR, run `npm run verify`. `.github/workflows/ci.yml` runs
  the same script, so a local pass means a CI pass. It runs lint and the build
  (`tsc -b`, Vite, then the meta prerender).
- Node version: `.nvmrc`. CI and deploy both read it.
- Dependabot (`.github/dependabot.yml`) opens grouped update PRs every Monday,
  after a 3-day cooldown (7 for majors). TypeScript >=7 is ignored until the
  lint/type tooling supports it.
- CI never renders the page. For changes to the 3D scene or to runtime
  libraries (three, @react-three/*, react, gsap, lenis), run
  `npm run build && npx vite preview`, open the site, click through the entry
  overlay, and check the console for errors.
