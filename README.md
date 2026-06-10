# alexmaclean.ca

Personal site of Alex MacLean — immersive media artist, experimental
electronic musician (Sunntack), and creative technologist.

The site is itself a small audiovisual piece: a generative WebGL ocean you
descend through as you scroll, with an opt-in generative soundscape (Web
Audio, zero audio assets) that the visuals react to.

## Stack

- Vite + React 19 + TypeScript (strict)
- three.js via @react-three/fiber + drei + postprocessing
- GSAP (ScrollTrigger, SplitText) + Lenis smooth scroll
- wouter routing · zustand state · CSS Modules + custom-property tokens
- Fraunces / Space Grotesk / Space Mono, self-hosted via Fontsource

## Develop

```sh
npm install
npm run migrate   # one-time: pulls + optimizes images from ../alexjsmac.github.io
npm run dev
```

`npm run build` typechecks, builds, then prerenders per-route HTML
(`scripts/prerender-meta.mjs`) so every deep link is a real file on GitHub
Pages with correct OG meta, and emits `sitemap.xml` + per-project OG cards.

Useful dev query params: `?q=high|mid|low|static` forces a quality tier
(`static` = no WebGL, CSS gradient fallback — also what
`prefers-reduced-motion` gets).

## Architecture notes

- `src/data/projects-meta.json` is the canonical project list (node-readable;
  the prerender script consumes it too). Prose bodies live in
  `src/content/<slug>.tsx`; `src/data/projects.ts` assembles everything with
  typed image data from the build manifest.
- `src/lib/frameBus.ts` carries all 60fps values (scroll, pointer, FFT
  bands, depth) as plain mutables — shaders and the camera read it inside
  `useFrame`; React never re-renders per frame.
- Scene colors are authored in **linear** space (`new THREE.Color(hex)`);
  the EffectComposer applies the final linear→sRGB encode. Don't add manual
  conversions on top.
- `src/scene/moods.ts` maps each route to a depth range + look; navigation
  *sinks* rather than cuts. The audio engine's filters track the same depth.
- The audio graph (`src/audio/`) is framework-free: looped generated noise
  beds, a detuned D drone, probabilistic pentatonic pings, and a generated
  impulse response for the reverb. The AudioContext is only ever created or
  resumed inside a user-gesture handler.

## Deploy / cutover (replacing the old Jekyll site)

The repo deploys to GitHub Pages via Actions (`.github/workflows/deploy.yml`,
artifact = `dist`, CNAME `www.alexmaclean.ca` included).

1. `git remote add origin git@github.com:alexjsmac/alexjsmac.github.io.git`
2. `git push -u origin main` — non-destructive: the old site keeps serving
   from `master` (legacy Jekyll build) until the switch is flipped.
3. On GitHub: Settings → General → default branch → `main`.
4. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
   The custom domain (`www.alexmaclean.ca`) persists in Pages settings.
5. Re-run the Deploy workflow if it ran before the flip; verify the site.
6. The live demos (`/datanimism/`, `/switch-jockey/`,
   `/oceanic-datanimism-vr/`, `/tidal-hybrid-interactive-visualizer/`) are
   separate project repos and are unaffected.

**Rollback:** Settings → Pages → Source → "Deploy from a branch" → `master`.
Keep `master` as the permanent archive of the old site.

Old URLs are preserved: `/portfolio/*` → `/work/*` (incl. the
`tidal-hybrid-interactive-visualizer` → `bev-deconstructed` rename),
`/cv` → `/cv.pdf`, `/blog*` → `/` — handled by `public/404.html`.
